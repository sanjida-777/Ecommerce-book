import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Book Lover',
    rating: 5,
    content: 'I\'ve been a loyal customer for years. The selection is amazing and the delivery is always prompt. Highly recommend!'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Literature Professor',
    rating: 5,
    content: 'The book recommendations are spot on! I discovered so many great authors through Bookshelf that I wouldn\'t have found otherwise.'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Avid Reader',
    rating: 4.5,
    content: 'Their customer service is exceptional. When my order was delayed, they followed up immediately and resolved the issue. Will shop here again!'
  }
];

export default function TestimonialsSection() {
  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <svg 
          key="half-star" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-yellow-400"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="50%" stopColor="none" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-fill)"
            stroke="currentColor"
            strokeWidth="1"
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      );
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
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="font-heading font-bold text-3xl text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex text-warning mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 italic mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
