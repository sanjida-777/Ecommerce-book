'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold mb-4">BookStore</h3>
            <p className="mb-4 text-gray-300">
              Your one-stop shop for all your reading needs. Quality books at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/books" className="text-gray-300 hover:text-accent transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-accent transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-300 hover:text-accent transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/bestsellers" className="text-gray-300 hover:text-accent transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-accent transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest releases and promotions.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full text-gray-900 rounded-l focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent text-primary px-4 py-2 rounded-r font-medium hover:bg-opacity-90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} BookStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}