import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useBooksByCategory, useSearchBooks } from '@/lib/hooks';
import { Book } from '@shared/schema';
import BookCard from '@/components/BookCard';
import CategoryTabs from '@/components/CategoryTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CategoryPage() {
  const [, params] = useRoute('/category/:category');
  const [location] = useLocation();
  const isSearchPage = location.startsWith('/search');
  
  // For search page
  const searchParams = new URLSearchParams(isSearchPage ? location.split('?')[1] : '');
  const searchQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(searchQuery);
  const { books: searchResults, loading: searchLoading } = useSearchBooks(searchQuery);
  
  // For category pages
  const category = params?.category || 'all';
  const isFeatured = category === 'featured';
  const isNewReleases = category === 'new-releases';
  
  const formattedCategory = category === 'all' 
    ? 'all' 
    : isFeatured 
      ? 'featured' 
      : isNewReleases 
        ? 'new-release' 
        : category;
  
  const { books, loading } = useBooksByCategory(formattedCategory);
  
  // Filtered books based on page type
  const displayBooks: Book[] = isSearchPage ? searchResults : books;
  const isLoading = isSearchPage ? searchLoading : loading;
  
  // Page title
  const getPageTitle = () => {
    if (isSearchPage) {
      return `Search Results for "${searchQuery}"`;
    }
    if (isFeatured) {
      return 'Featured Books';
    }
    if (isNewReleases) {
      return 'New Releases';
    }
    return `${category.charAt(0).toUpperCase() + category.slice(1)} Books`;
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
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
      {!isSearchPage && <CategoryTabs />}
      
      <div className="container mx-auto px-6 py-8">
        {isSearchPage ? (
          <>
            <Button
              variant="link"
              className="mb-4 p-0 text-primary"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <h1 className="text-3xl font-heading font-bold mb-6">{getPageTitle()}</h1>
            
            <form onSubmit={handleSearch} className="mb-8 max-w-lg">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for books..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">Search</Button>
              </div>
            </form>
          </>
        ) : (
          <h1 className="text-3xl font-heading font-bold mb-6">{getPageTitle()}</h1>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {renderSkeletons(8)}
          </div>
        ) : displayBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                isNewRelease={isNewReleases || book.newRelease}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <BookOpenCheck className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-heading font-bold mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              {isSearchPage
                ? "We couldn't find any books matching your search. Please try different keywords."
                : "There are no books in this category yet. Check back later!"}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        )}
      </div>
    </>
  );
}
