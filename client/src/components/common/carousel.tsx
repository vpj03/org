import { ReactNode, useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  itemClassName?: string;
}

function Carousel<T>({ items, renderItem, className = '', itemClassName = '' }: CarouselProps<T>) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const container = carouselRef.current;
      if (!container) return;

      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    };

    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      // Also check when window resizes
      window.addEventListener('resize', checkScroll);
      
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [items]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = Math.min(carouselRef.current.clientWidth * 0.8, 300);
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = Math.min(carouselRef.current.clientWidth * 0.8, 300);
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        ref={carouselRef}
        className={`flex overflow-x-auto scroll-hidden carousel ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100 z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </button>
      )}
      
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow hover:bg-gray-100 z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </button>
      )}
    </div>
  );
}

export default Carousel;
