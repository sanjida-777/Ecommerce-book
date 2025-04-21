'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { getCount, toggleCart } = useCart();
  const cartCount = getCount();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            BookStore
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation */}
          <nav className={`
            absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto
            bg-primary md:bg-transparent z-50 shadow-lg md:shadow-none
            transition-all duration-300 ease-in-out
            ${mobileMenuOpen ? 'block' : 'hidden md:block'}
          `}>
            <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 p-4 md:p-0">
              <li>
                <Link 
                  href="/books" 
                  className="block py-2 md:py-0 hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Books
                </Link>
              </li>
              <li>
                <Link 
                  href="/categories" 
                  className="block py-2 md:py-0 hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Categories
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    href="/admin" 
                    className="block py-2 md:py-0 hover:text-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart button */}
            <button 
              className="flex items-center relative hover:text-accent transition-colors"
              onClick={toggleCart}
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User actions */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center hover:text-accent transition-colors">
                  <User size={24} />
                  <span className="ml-2 hidden md:inline">{user?.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/auth"
                className="flex items-center hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={24} />
                <span className="ml-2 hidden md:inline">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}