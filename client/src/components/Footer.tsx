import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Bookshelf</h3>
            <p className="mb-4">Your trusted source for books since 2010. We believe in the power of reading to transform lives.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-accent">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/all" className="text-white text-opacity-80 hover:text-accent">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/category/new-releases" className="text-white text-opacity-80 hover:text-accent">
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/category/featured" className="text-white text-opacity-80 hover:text-accent">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Book Club Picks
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white text-opacity-80 hover:text-accent">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white border-opacity-20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-opacity-60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Bookshelf. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-white text-opacity-60 text-sm hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white text-opacity-60 text-sm hover:text-accent">
              Terms of Service
            </Link>
            <Link href="#" className="text-white text-opacity-60 text-sm hover:text-accent">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
