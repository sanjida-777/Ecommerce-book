import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import AuthModal from './AuthModal';

import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  ChevronDown,
  Loader
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { categories } from '@/lib/demoData';

export default function Header() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { cartCount, toggleCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Redirect to search results
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearching(false);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <h1 className="text-2xl font-heading font-bold">Bookshelf</h1>
            </Link>
            <nav className="hidden md:flex ml-8">
              <Link href="/" className="mx-3 py-2 text-white hover:text-accent transition">
                Home
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center mx-3 py-2 text-white hover:text-accent transition">
                    Categories <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} asChild>
                      <Link href={`/category/${category === 'All' ? 'all' : category.toLowerCase()}`} className="w-full">
                        {category}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/category/new-releases" className="mx-3 py-2 text-white hover:text-accent transition">
                New Releases
              </Link>
              <Link href="/category/featured" className="mx-3 py-2 text-white hover:text-accent transition">
                Bestsellers
              </Link>
              {isAdmin && (
                <Link href="/admin" className="mx-3 py-2 text-white hover:text-accent transition">
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative mr-4 hidden md:block">
              <input
                type="text"
                placeholder="Search for books..."
                className="bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 rounded-full py-1 px-4 focus:outline-none focus:bg-white focus:text-text focus:placeholder-gray-500 transition pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 mt-1 mr-3">
                {isSearching ? (
                  <Loader className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Search className="h-5 w-5 text-white" />
                )}
              </button>
            </form>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:text-accent transition"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-4 flex items-center text-white hover:text-accent transition">
                    <User className="h-5 w-5 mr-1" />
                    <span className="hidden md:inline">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="ml-4 flex items-center text-white hover:text-accent transition"
                onClick={openAuthModal}
              >
                <User className="h-5 w-5 mr-1" />
                <span className="hidden md:inline">Account</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search for books..."
                className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 rounded-full py-1 px-4 focus:outline-none focus:bg-white focus:text-text focus:placeholder-gray-500 transition pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-0 mt-1 mr-3">
                {isSearching ? (
                  <Loader className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <Search className="h-5 w-5 text-white" />
                )}
              </button>
            </form>
            <Link href="/" className="block py-2 text-white hover:text-accent transition" onClick={toggleMobileMenu}>
              Home
            </Link>
            <div className="relative py-2">
              <button className="flex items-center text-white hover:text-accent transition w-full text-left">
                Categories <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="pl-4 pt-2">
                {categories.map((category) => (
                  <Link 
                    key={category}
                    href={`/category/${category === 'All' ? 'all' : category.toLowerCase()}`} 
                    className="block py-2 text-white hover:text-accent transition"
                    onClick={toggleMobileMenu}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/category/new-releases" className="block py-2 text-white hover:text-accent transition" onClick={toggleMobileMenu}>
              New Releases
            </Link>
            <Link href="/category/featured" className="block py-2 text-white hover:text-accent transition" onClick={toggleMobileMenu}>
              Bestsellers
            </Link>
            {isAdmin && (
              <Link href="/admin" className="block py-2 text-white hover:text-accent transition" onClick={toggleMobileMenu}>
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </header>
  );
}
