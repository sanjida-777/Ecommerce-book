import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useBook } from '@/lib/hooks';
import { useCart } from '@/lib/cart';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart, ArrowLeft, Star, StarHalf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BookDetails() {
  const [, params] = useRoute('/book/:id');
  const bookId = params ? parseInt(params.id) : 0;
  const { book, loading } = useBook(bookId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book.id, quantity);
    }
  };

  const incrementQuantity = () => {
    if (book && quantity < book.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-5 w-5 fill-current text-yellow-400" />);
    }

    // Add empty stars to make 5 stars total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-star-${i}`} 
          className="h-5 w-5 text-yellow-400 stroke-current fill-none" 
        />
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="md:flex -mx-6">
          <div className="md:w-1/3 px-6 mb-8 md:mb-0">
            <Skeleton className="w-full h-96 rounded-lg" />
          </div>
          <div className="md:w-2/3 px-6">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <div className="flex items-center mb-6">
              <Skeleton className="h-10 w-32 mr-4" />
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Book Not Found</h2>
        <p className="mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link href="/category/all">
          <Button>Browse All Books</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <Link href="/category/all" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Books
      </Link>

      <div className="md:flex -mx-6">
        <div className="md:w-1/3 px-6 mb-8 md:mb-0">
          <div className="sticky top-6">
            <div className="relative">
              <img 
                src={book.imageUrl} 
                alt={`Cover of ${book.title} by ${book.author}`} 
                className="w-full rounded-lg shadow-md mb-4"
              />
              {book.newRelease && (
                <div className="absolute top-0 left-0 bg-secondary text-white px-3 py-1 text-sm font-bold">
                  NEW
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{book.category}</Badge>
              {book.featured && <Badge variant="outline">Bestseller</Badge>}
            </div>
          </div>
        </div>
        <div className="md:w-2/3 px-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex mr-2">
              {renderStars(Number(book.rating))}
            </div>
            <span className="text-gray-600">({book.reviewCount} reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-primary mb-6">${Number(book.price).toFixed(2)}</div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{book.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-700 mr-2">Availability:</span>
              {book.stock > 0 ? (
                <span className="text-green-600 font-semibold">In Stock ({book.stock} available)</span>
              ) : (
                <span className="text-red-600 font-semibold">Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={incrementQuantity}
                disabled={book.stock <= quantity}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="bg-primary hover:bg-opacity-90 text-white"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
