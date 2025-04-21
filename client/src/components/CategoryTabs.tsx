import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { categories } from '@/lib/demoData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryTabs() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if tabs are scrollable
  useEffect(() => {
    const checkScroll = () => {
      if (tabsRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Update scroll buttons when scrolling
  const handleScroll = () => {
    if (tabsRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setLocation('/category/all');
    } else {
      setLocation(`/category/${category.toLowerCase()}`);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const container = tabsRef.current;
      const scrollAmount = 200;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6 relative">
        {showScrollButtons && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 bg-white ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : ''}`}
              onClick={() => scrollTabs('left')}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full opacity-80 bg-white ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : ''}`}
              onClick={() => scrollTabs('right')}
              disabled={!canScrollRight}
            >
              <ChevronRight size={16} />
            </Button>
          </>
        )}
        <div 
          ref={tabsRef}
          className="flex overflow-x-auto scrollbar-hide pb-2 pl-4 pr-4"
          onScroll={handleScroll}
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`px-6 py-3 mx-2 whitespace-nowrap rounded-full font-semibold flex-shrink-0 ${
                selectedCategory === category 
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-text'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
