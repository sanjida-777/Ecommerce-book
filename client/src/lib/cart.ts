import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, CartItem } from '@shared/schema';
import { cartService, bookService, orderService } from './services';
import { useAuth } from './auth';

interface CartContextType {
  cartItems: (CartItem & { book: Book })[];
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  addToCart: (bookId: number, quantity?: number) => void;
  updateQuantity: (cartItemId: number, quantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
  clearCart: () => void;
  checkout: () => Promise<number | null>;
  isCheckingOut: boolean;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartTotal: 0,
  cartCount: 0,
  isCartOpen: false,
  toggleCart: () => {},
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  checkout: async () => null,
  isCheckingOut: false,
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<(CartItem & { book: Book })[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Load cart from local storage
  useEffect(() => {
    if (user) {
      const items = cartService.getCartItems(user.id.toString());
      const allBooks = bookService.getAll();

      const itemsWithDetails = items.map(item => {
        const book = allBooks.find(b => b.id === item.bookId);
        if (!book) throw new Error(`Book with ID ${item.bookId} not found`);
        return { ...item, book };
      });

      setCartItems(itemsWithDetails);
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Update cart total and count
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => 
      sum + (Number(item.book.price) * item.quantity), 0);
    
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setCartCount(count);
  }, [cartItems]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addToCart = (bookId: number, quantity = 1) => {
    if (!user) return;
    
    try {
      const book = bookService.getById(bookId);
      if (!book) throw new Error(`Book with ID ${bookId} not found`);
      
      const cartItem = cartService.addToCart({
        userId: user.id.toString(),
        bookId,
        quantity
      });
      
      // Check if this book already exists in the cart
      const existingItemIndex = cartItems.findIndex(item => item.bookId === bookId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex] = {
          ...updatedCartItems[existingItemIndex],
          quantity: updatedCartItems[existingItemIndex].quantity + quantity
        };
        setCartItems(updatedCartItems);
      } else {
        // Add new item
        setCartItems([...cartItems, { ...cartItem, book }]);
      }
      
      // Open cart after adding item
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      const itemIndex = cartItems.findIndex(item => item.id === cartItemId);
      if (itemIndex === -1) return;
      
      const updatedItem = {
        ...cartItems[itemIndex],
        quantity
      };
      
      cartService.updateCartItem(updatedItem);
      
      const updatedCartItems = [...cartItems];
      updatedCartItems[itemIndex] = updatedItem;
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = (cartItemId: number) => {
    try {
      cartService.removeFromCart(cartItemId);
      setCartItems(cartItems.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    if (!user) return;
    
    try {
      cartService.clearCart(user.id.toString());
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const checkout = async (): Promise<number | null> => {
    if (!user || cartItems.length === 0) return null;
    
    try {
      setIsCheckingOut(true);
      
      // Create order
      const order = orderService.createOrder(user.id.toString(), cartTotal);
      
      // Create order items
      const orderItems = cartItems.map(item => ({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        price: item.book.price
      }));
      
      orderService.createOrderItems(orderItems);
      
      // Update book stock
      cartItems.forEach(item => {
        const book = bookService.getById(item.bookId);
        if (book) {
          const updatedBook = {
            ...book,
            stock: Math.max(book.stock - item.quantity, 0)
          };
          bookService.updateBook(updatedBook);
        }
      });
      
      // Clear cart
      clearCart();
      
      return order.id;
    } catch (error) {
      console.error('Error during checkout:', error);
      return null;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const value = {
    cartItems,
    cartTotal,
    cartCount,
    isCartOpen,
    toggleCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
    isCheckingOut
  };

  return React.createElement(CartContext.Provider, { value }, children);
};
