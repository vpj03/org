import { useState } from 'react';
import { Heart, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import ProductModal from './product-modal';
import { useWishlist } from '@/hooks/use-wishlist';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isProductInWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to add items to your cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/cart/items', {
        productId: product.id,
        quantity: 1
      });

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to manage your wishlist',
        variant: 'destructive',
      });
      return;
    }

    await toggleWishlist(product.id);
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition h-full flex flex-col cursor-pointer"
        onClick={openModal}
      >
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover"
          />
          {product.isOrganic && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded">Organic</span>
          )}
          <button 
            className={`absolute top-2 right-2 bg-white rounded-full p-2 shadow-md ${isProductInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-primary'}`}
            onClick={handleToggleWishlist}
            aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-5 w-5 ${isProductInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-textDark mb-1">{product.name}</h3>
          <div className="flex items-center mb-2">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="h-4 w-4 fill-current" 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">(0)</span>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div>
              <span className="text-lg font-semibold text-primary">{formatPrice(product.discountPrice || product.price)}</span>
              {product.discountPrice && (
                <span className="text-sm text-gray-500 line-through ml-1">{formatPrice(product.price)}</span>
              )}
            </div>
            {discountPercentage > 0 && (
              <span className="text-xs bg-green-100 text-success py-1 px-2 rounded">{discountPercentage}% off</span>
            )}
          </div>
        </div>
        <div className="p-3 bg-gray-50 border-t" onClick={(e) => e.stopPropagation()}>
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded font-medium text-sm transition"
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal 
        product={product}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default ProductCard;
