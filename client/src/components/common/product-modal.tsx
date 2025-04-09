import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useWishlist } from '@/hooks/use-wishlist'; // Import useWishlist

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist } = useWishlist(); // Use wishlist context
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const isProductInWishlist = isInWishlist(product.id); // Check wishlist status from context

  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleAddToCart = async () => {
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
        quantity
      });

      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: 'Please login',
        description: 'You need to login to manage your wishlist',
        variant: 'destructive',
      });
      return;
    }
    // Use toggleWishlist from context
    await toggleWishlist(product.id);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-gray-600 z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col md:flex-row">
            {/* Product Image */}
            <div className="md:w-1/2 p-6 bg-gray-50 flex items-center justify-center">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="max-h-[400px] object-contain" 
                />
                {product.isOrganic && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded">
                    Organic
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="absolute top-2 right-2 bg-accent text-white text-xs py-1 px-2 rounded">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
              
              <div className="flex items-center mb-2">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">(0 reviews)</span>
              </div>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="bg-gray-100 p-2 rounded-l-md"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="bg-gray-100 px-4 py-2 text-center min-w-[50px]">
                    {quantity}
                  </span>
                  <button 
                    onClick={increaseQuantity}
                    className="bg-gray-100 p-2 rounded-r-md"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded font-medium"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className={`flex-1 py-2 px-4 rounded font-medium border ${isProductInWishlist ? 'text-red-500 border-red-500' : 'text-gray-700 border-gray-300'}`} // Use context state
                >
                  <Heart className={`h-5 w-5 mr-2 ${isProductInWishlist ? 'fill-current' : ''}`} /> {/* Use context state */}
                  {isProductInWishlist ? 'Wishlisted' : 'Add to Wishlist'} {/* Use context state */}
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Details</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Organic: {product.isOrganic ? 'Yes' : 'No'}</li>
                  <li>• Stock: {product.stock} available</li>
                  {product.brandId && <li>• Brand: Premium Quality</li>}
                  <li>• Category: Fresh Produce</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;