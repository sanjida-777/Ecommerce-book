import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function CartSidebar() {
  const { 
    cartItems, 
    cartTotal, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const shippingCost = cartTotal > 0 ? 5.99 : 0;
  const totalWithShipping = cartTotal + shippingCost;

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleCart}>
      <div 
        className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-heading font-bold text-2xl">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                <X className="h-6 w-6 text-gray-500" />
              </Button>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="font-heading font-bold text-xl mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Start shopping to add items to your cart.</p>
                <Button onClick={toggleCart}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex mb-6 pb-6 border-b border-gray-200">
                  <div className="w-20 h-24 flex-shrink-0 mr-4">
                    <Link href={`/book/${item.bookId}`} onClick={toggleCart}>
                      <img 
                        src={item.book.imageUrl} 
                        alt={item.book.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </Link>
                  </div>
                  <div className="flex-grow">
                    <Link href={`/book/${item.bookId}`} onClick={toggleCart}>
                      <h3 className="font-heading font-bold text-base mb-1">
                        {item.book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.book.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-primary font-bold">
                        ${(Number(item.book.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-red-500 ml-2 h-auto"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalWithShipping.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout" onClick={toggleCart}>
                <Button className="w-full bg-primary hover:bg-opacity-90 text-white py-3 mb-3">
                  Proceed to Checkout
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border border-primary text-primary hover:bg-primary hover:text-white py-3"
                onClick={toggleCart}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
