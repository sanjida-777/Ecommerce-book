'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { demoBooks } from '../lib/demoData';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  
  useEffect(() => {
    // In a real app, we would fetch from API
    setBooks(demoBooks);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <img 
                src={book.coverImage || 'https://via.placeholder.com/150'} 
                alt={book.title}
                className="h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">${parseFloat(book.price).toFixed(2)}</span>
                <span className="text-sm text-gray-500">{book.category}</span>
              </div>
              <Link 
                href={`/books/${book.id}`}
                className="block w-full mt-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Link 
          href="/"
          className="text-blue-600 hover:underline font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}