import { useEffect } from 'react';
import { initializeLocalStorage } from '@/lib/services';
import { demoBooks } from '@/lib/demoData';
import { useFeaturedBooks, useNewReleases } from '@/lib/hooks';

import Hero from '@/components/Hero';
import CategoryTabs from '@/components/CategoryTabs';
import BookCard from '@/components/BookCard';
import FeaturedCategories from '@/components/FeaturedCategories';
import PromoSection from '@/components/PromoSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  // Initialize local storage with demo data
  useEffect(() => {
    initializeLocalStorage(demoBooks);
  }, []);

  const { books: featuredBooks, loading: loadingFeatured } = useFeaturedBooks();
  const { books: newReleases, loading: loadingNewReleases } = useNewReleases();

  // Render book card skeletons
  const renderSkeletons = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
          <Skeleton className="h-64 w-full" />
          <div className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <Hero />
      <CategoryTabs />
      
      {/* Featured Books Section */}
      <section id="featured-books" className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl mb-8">Trending This Week</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingFeatured
              ? renderSkeletons(4)
              : featuredBooks.slice(0, 4).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/category/featured">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md font-semibold transition"
              >
                View All Books
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Releases Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl mb-8">New Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingNewReleases
              ? renderSkeletons(4)
              : newReleases.slice(0, 4).map((book) => (
                  <BookCard key={book.id} book={book} isNewRelease={true} />
                ))}
          </div>
        </div>
      </section>
      
      <FeaturedCategories />
      <PromoSection />
      <TestimonialsSection />
    </>
  );
}
