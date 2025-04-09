import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import ProductCard from '@/components/common/product-card';
import Carousel from '@/components/common/carousel';
import { Link } from 'wouter';

interface ProductSectionProps {
  title: string;
  categoryId?: number;
  limit?: number;
}

const ProductSection = ({ title, categoryId, limit = 10 }: ProductSectionProps) => {
  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: categoryId 
      ? ['/api/products/category', categoryId] 
      : ['/api/products'],
  });

  // Filter by category if categoryId is provided
  const filteredProducts = categoryId
    ? products.filter(product => product.categoryId === categoryId).slice(0, limit)
    : products.slice(0, limit);

  // Default products if no data or loading
  const defaultProducts = [
    {
      id: 1,
      name: "Organic Spinach",
      description: "Fresh organic spinach",
      price: 6000,
      discountPrice: 4500,
      categoryId: 1,
      brandId: 1,
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      stock: 100,
      isOrganic: true,
      sellerId: 1,
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Organic Tomatoes",
      description: "Fresh organic tomatoes",
      price: 7500,
      discountPrice: 6000,
      categoryId: 1,
      brandId: 1,
      image: "https://images.unsplash.com/photo-1603048719539-9ecb1b993046?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      stock: 80,
      isOrganic: true,
      sellerId: 1,
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Organic Carrots",
      description: "Fresh organic carrots",
      price: 5500,
      discountPrice: null,
      categoryId: 1,
      brandId: 2,
      image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      stock: 90,
      isOrganic: true,
      sellerId: 2,
      createdAt: new Date()
    },
    {
      id: 4,
      name: "Organic Bell Peppers",
      description: "Fresh organic bell peppers",
      price: 9500,
      discountPrice: 8000,
      categoryId: 1,
      brandId: 2,
      image: "https://images.unsplash.com/photo-1597118850-5195e8dc93bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      stock: 70,
      isOrganic: true,
      sellerId: 2,
      createdAt: new Date()
    },
    {
      id: 5,
      name: "Organic Broccoli",
      description: "Fresh organic broccoli",
      price: 8000,
      discountPrice: 6500,
      categoryId: 1,
      brandId: 3,
      image: "https://images.unsplash.com/photo-1550326107-7fe6ba98dcbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      stock: 60,
      isOrganic: true,
      sellerId: 3,
      createdAt: new Date()
    }
  ];

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : defaultProducts;

  const renderProduct = (product: Product) => (
    <ProductCard key={product.id} product={product} />
  );

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-textDark">{title}</h2>
          <Link href={categoryId ? `/category/${categoryId}` : "/products"} className="text-primary hover:underline font-medium">
            View All
          </Link>
        </div>
        
        <Carousel
          items={displayProducts}
          renderItem={renderProduct}
          className="gap-4 pb-4"
          itemClassName="flex-shrink-0 w-56 md:w-64"
        />
      </div>
    </section>
  );
};

export default ProductSection;
