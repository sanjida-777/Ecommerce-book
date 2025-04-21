'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, ArrowLeft, Clock, Package } from 'lucide-react';
import { demoBooks } from '../../lib/demoData';
import { Book } from '../../lib/schema';
import { useCart } from '../../lib/cart';

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = parseInt(params.id as string);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  useEffect(() => {
    // In a real app, we would fetch from API
    const foundBook = demoBooks.find(book => book.id === bookId);
    setBook(foundBook || null);
    setLoading(false);
  }, [bookId]);
  
  const handleAddToCart = () => {
    if (book) {
      addItem(book, quantity);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
            <div className="md:w-2/3">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link href="/books" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2" size={16} />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-8">
        <Link href="/books" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2" size={16} />
          Back to Books
        </Link>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
          <img 
            src={book.imageUrl || 'https://via.placeholder.com/400x600?text=No+Image'} 
            alt={book.title} 
            className="max-h-[500px] object-contain"
          />
        </div>
        
        {/* Book Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index}
                  size={20}
                  className={`${
                    index < Math.floor(parseFloat(book.rating))
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{book.rating} ({book.reviewCount} reviews)</span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold">${parseFloat(book.price).toFixed(2)}</span>
            {book.newRelease && (
              <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                New Release
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{book.description}</p>
          </div>
          
          {/* Stock and Shipping Info */}
          <div className="mb-8">
            <div className="flex items-center text-sm mb-2">
              <Package className="mr-2 text-green-500" size={16} />
              <span className={book.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {book.stock > 0 ? `In Stock (${book.stock} available)` : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 text-blue-500" size={16} />
              <span className="text-gray-600">Ships in 1-2 business days</span>
            </div>
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md shadow-sm py-2 px-4 mr-4 focus:outline-none focus:ring-primary focus:border-primary"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="flex-1 flex items-center justify-center bg-primary text-white py-3 px-6 rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-2" size={20} />
                Add to Cart
              </button>
            </div>
          </div>
          
          {/* Book Info */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold mb-4">Book Information</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-600">Category:</div>
              <div>{book.category}</div>
              
              <div className="text-gray-600">ID:</div>
              <div>#{book.id}</div>
              
              <div className="text-gray-600">Rating:</div>
              <div>{book.rating} out of 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}