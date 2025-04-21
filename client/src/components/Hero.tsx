import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-primary text-white">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-lg mb-6 md:pr-10">
              From bestsellers to hidden gems, find the perfect read for every moment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/all">
                <Button className="bg-secondary hover:bg-opacity-90 text-white px-6 py-3 rounded-md font-semibold shadow-md transition">
                  Browse Books
                </Button>
              </Link>
              <Link href="#book-club">
                <Button variant="outline" className="bg-transparent border-2 border-white hover:bg-white hover:text-primary px-6 py-3 rounded-md font-semibold transition">
                  Join Book Club
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1521056787327-165eb7a0df35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Bookstore Interior" 
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
