import { Link } from 'wouter';
import { Book } from '@shared/schema';
import { useCart } from '@/lib/cart';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookCardProps {
  book: Book;
  isNewRelease?: boolean;
}

export default function BookCard({ book, isNewRelease = false }: BookCardProps) {
  const { addToCart } = useCart();

  const { 
    id, 
    title, 
    author, 
    price, 
    imageUrl, 
    category, 
    stock, 
    rating, 
    reviewCount 
  } = book;

  const handleAddToCart = () => {
    addToCart(id, 1);
  };

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(Number(rating));
    const hasHalfStar = Number(rating) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-current text-yellow-400" />);
    }

    // Add empty stars to make 5 stars total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-star-${i}`} 
          className="h-4 w-4 text-yellow-400 stroke-current fill-none" 
        />
      );
    }

    return stars;
  };

  return (
    <div className="book-card bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-64 overflow-hidden">
        <Link href={`/book/${id}`}>
          <img 
            src={imageUrl} 
            alt={`Cover of ${title} by ${author}`} 
            className="w-full h-full object-cover transition duration-300 hover:scale-105"
          />
        </Link>
        {isNewRelease && (
          <div className="absolute top-0 left-0 bg-secondary text-white px-3 py-1 text-sm font-bold">
            NEW
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="category-chip">{category}</span>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/book/${id}`}>
          <h3 className="font-heading font-bold text-lg mb-1 hover:text-secondary transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2">{author}</p>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <div className="flex">
              {renderStars()}
            </div>
            <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
          </div>
          <span className="text-primary font-bold">${Number(price).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            In stock: <span className={`font-semibold ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{stock}</span>
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="bg-primary hover:bg-opacity-90 text-white px-3 py-1 rounded text-sm"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
