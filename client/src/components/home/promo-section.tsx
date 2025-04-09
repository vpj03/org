import { useQuery } from '@tanstack/react-query';
import { PromoAd } from '@shared/schema';
import { Button } from '@/components/ui/button';

const PromoSection = () => {
  const { data: promoAds = [], isLoading, error } = useQuery<PromoAd[]>({
    queryKey: ['/api/promo-ads'],
  });

  // Default promo if no data or loading
  const defaultPromo = {
    title: "Launch Offer: 20% OFF",
    description: "On your first order with code: ORGFRESH",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
  };

  const promo = promoAds.length > 0 ? promoAds[0] : defaultPromo;

  return (
    <section className="py-6 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl shadow-md">
          <img 
            src={promo.image} 
            alt={promo.title} 
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
