import { useQuery } from '@tanstack/react-query';
import { Ebook } from '@shared/schema';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useEffect } from 'react';

const EbookSection = () => {
  const { data: ebooks = [], isLoading, error } = useQuery<Ebook[]>({
    queryKey: ['/api/ebooks'],
  });

  // Default ebooks if no data or loading
  const defaultEbooks = [
    {
      id: 1,
      title: 'Organic Living: A Complete Guide',
      description: 'Learn how to incorporate organic foods into your daily life for better health and sustainable living.',
      author: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      content: 'Full content goes here...',
      createdBy: 1
    },
    {
      id: 2,
      title: 'Superfoods: Boosting Your Immunity',
      description: 'Discover the power of superfoods and how they can transform your health and boost your immune system.',
      author: 'Mark Williams, Nutritionist',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      content: 'Full content goes here...',
      createdBy: 1
    },
    {
      id: 3,
      title: '30 Days of Green Smoothies',
      description: 'Transform your health with these simple, delicious green smoothie recipes perfect for beginners.',
      author: 'Chef Amanda Cooper',
      image: 'https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      content: 'Full content goes here...',
      createdBy: 1
    },
    {
      id: 4,
      title: 'Beginner\'s Guide to Organic Gardening',
      description: 'Start your own organic garden with this comprehensive guide for beginners - no experience needed!',
      author: 'James Peterson, Master Gardener',
      image: 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      content: 'Full content goes here...',
      createdBy: 1
    }
  ];

  const displayEbooks = ebooks.length > 0 ? ebooks : defaultEbooks;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 3000 })]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // Reinitialize Embla to ensure proper looping
      emblaApi.on('select', () => {
        // Optional: Add logic here if you want to handle slide changes
      });
    }
  }, [emblaApi]);

  const renderEbook = (ebook: Ebook) => (
    <div key={ebook.id} className="embla__slide flex-shrink-0 w-64 md:w-72">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col">
        <div className="relative h-48">
          <img src={ebook.image} alt={ebook.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-textDark mb-2">{ebook.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <UserCircle className="mr-2 h-4 w-4" />
            <span>By {ebook.author}</span>
          </div>
        </div>
        <div className="p-3 bg-gray-50 border-t">
          <Link href={`/ebook/${ebook.id}`}>
            <Button className="w-full bg-accent hover:bg-accent/90 text-white py-2 rounded font-medium text-sm transition">
              Read Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-textDark">Health E-books</h2>
          <Link href="/ebooks" className="text-primary hover:underline font-medium">
            View All
          </Link>
        </div>
        
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex gap-6 pb-4">
            {displayEbooks.map(renderEbook)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookSection;
