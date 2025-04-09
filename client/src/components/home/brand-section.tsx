import { useQuery } from '@tanstack/react-query';
import { Brand } from '@shared/schema';
import { Link } from 'wouter';
import EmblaCarouselReact from 'embla-carousel-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect, useRef } from 'react';

const BrandSection = () => {
  const { data: brands = [], isLoading, error } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  // Default brands if no data or loading
  const defaultBrands = [
    { id: 1, name: 'Nature Bounty', image: 'https://via.placeholder.com/160x80.png?text=NatureBounty', createdBy: 1 },
    { id: 2, name: 'Organic Harvest', image: 'https://via.placeholder.com/160x80.png?text=OrganicHarvest', createdBy: 1 },
    { id: 3, name: 'Earth Foods', image: 'https://via.placeholder.com/160x80.png?text=EarthFoods', createdBy: 1 },
    { id: 4, name: 'Green Valley', image: 'https://via.placeholder.com/160x80.png?text=GreenValley', createdBy: 1 },
    { id: 5, name: 'Pure Nature', image: 'https://via.placeholder.com/160x80.png?text=PureNature', createdBy: 1 },
    { id: 6, name: 'Fresh Fields', image: 'https://via.placeholder.com/160x80.png?text=FreshFields', createdBy: 1 },
  ];

  const displayBrands = brands.length > 0 ? brands : defaultBrands;

  const renderBrand = (brand: Brand) => (
    <div key={brand.id} className="embla__slide flex-shrink-0 w-40 md:w-48">
      <Link href={`/brand/${brand.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition p-4 h-full">
        <div className="h-16 flex items-center justify-center mb-3">
          <img src={brand.image} alt={brand.name} className="max-h-full max-w-full" />
        </div>
        <p className="text-center text-sm text-gray-700">25+ Products</p>
      </Link>
    </div>
  );

  const autoplay = useRef(Autoplay({ delay: 3000 }));
  const [emblaRef] = useEmblaCarousel({ loop: true }, [autoplay.current]);

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-textDark">Shop By Brands</h2>
        </div>
        
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-6">
            {displayBrands.map(renderBrand)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
