'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { demoBooks, categories } from '../lib/demoData';
import BookCard from '../components/BookCard';
import { Book } from '../lib/schema';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [books, setBooks] = useState<Book[]>([]);
  
  useEffect(() => {
    if (selectedCategory === 'All') {
      setBooks(demoBooks);
    } else {
      setBooks(demoBooks.filter((book) => book.category === selectedCategory));
    }
  }, [selectedCategory]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse by Category</h1>
      
      {/* Category tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 min-w-max pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Books grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              isNewRelease={book.newRelease}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="mt-2 text-sm text-gray-500">
            There are no books in the {selectedCategory} category yet.
          </p>
        </div>
      )}
    </div>
  );
}