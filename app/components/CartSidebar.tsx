'use client';

import { X, ShoppingBag, Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../lib/cart';

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotal 
  } = useCart();
  
  const total = getTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={toggleCart}
      ></div>
      
      {/* Cart sidebar */}
      <div className="relative w-full max-w-md bg-white shadow-xl overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-6 bg-primary text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Your Cart ({items.length})
          </h2>
          <button 
            onClick={toggleCart}
            className="hover:text-accent transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
                <ShoppingBag size={64} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-gray-500 mb-4">Looks like you haven't added any books to your cart yet.</p>
              <button
                onClick={toggleCart}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex border-b pb-4">
                  {/* Image */}
                  <div className="w-20 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.book.imageUrl || 'https://via.placeholder.com/80x100?text=No+Image'} 
                      alt={item.book.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900 line-clamp-1">{item.book.title}</h3>
                    <p className="text-sm text-gray-500">{item.book.author}</p>
                    <div className="text-sm text-gray-500 mt-1">
                      ${parseFloat(item.book.price).toFixed(2)} each
                    </div>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-primary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle size={18} />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <PlusCircle size={18} />
                      </button>
                      
                      {/* Subtotal */}
                      <div className="ml-auto font-medium">
                        ${(parseFloat(item.book.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {/* Clear cart button */}
              <div className="text-right">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with total and checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="block w-full bg-primary text-white py-3 rounded text-center font-medium hover:bg-opacity-90 transition-colors"
              onClick={toggleCart}
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}