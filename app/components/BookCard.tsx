'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Book } from '../lib/schema';
import { useCart } from '../lib/cart';

interface BookCardProps {
  book: Book;
  isNewRelease?: boolean;
}

export default function BookCard({ book, isNewRelease = false }: BookCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(book, 1);
  };
  
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      {/* Image container */}
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={book.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-2">
        {isNewRelease && (
          <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded">
            NEW
          </span>
        )}
        {book.featured && (
          <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold line-clamp-1 mb-1">
          {book.title}
        </h2>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm ml-1">{book.rating}</span>
          <span className="text-xs text-gray-500 ml-1">({book.reviewCount} reviews)</span>
        </div>
        
        {/* Price and category */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-lg">${parseFloat(book.price).toFixed(2)}</span>
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            {book.category}
          </span>
        </div>
        
        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white py-2 px-3 rounded flex items-center justify-center hover:bg-opacity-90 transition-colors"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span>Add to Cart</span>
          </button>
          
          <Link
            href={`/books/${book.id}`}
            className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}