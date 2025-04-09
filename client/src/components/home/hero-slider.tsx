import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { HeroSlider as HeroSliderType } from '@shared/schema';
import { Button } from '@/components/ui/button';

const HeroSlider = () => {
  const { data: heroSliders = [], isLoading, error } = useQuery<HeroSliderType[]>({
    queryKey: ['/api/hero-sliders'],
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Auto-advance slider every 5 seconds
    const interval = setInterval(() => {
      if (heroSliders.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % heroSliders.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [heroSliders.length]);
  
  const goToPrev = () => {
    if (heroSliders.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + heroSliders.length) % heroSliders.length);
    }
  };
  
  const goToNext = () => {
    if (heroSliders.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % heroSliders.length);
    }
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Default hero if no data or loading
  const defaultHero = {
    title: "Fresh Organic Produce Delivered",
    description: "100% certified organic fruits and vegetables straight from farms to your doorstep",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
  };
  
  // Use default hero when loading or no data
  const slides = heroSliders.length > 0 ? heroSliders : [defaultHero];

  return (
    <section className="relative">
      <div className="relative overflow-hidden" style={{ height: "400px" }}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Removed color overlay */}
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center z-10">
              <div className="container mx-auto px-4">
                <div className="max-w-lg">
                  <h1 className="text-white text-4xl md:text-5xl font-bold font-heading mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-white text-lg mb-6">
                    {slide.description}
                  </p>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-700 text-white py-7 px-6 rounded-full font-medium shadow-lg"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Controls */}
        <button 
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button 
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 ${
                index === currentIndex ? 'w-6' : 'w-2'
              } rounded-full bg-white ${
                index === currentIndex ? 'opacity-100' : 'opacity-50 hover:opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
