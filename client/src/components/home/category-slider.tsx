import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import Carousel from '@/components/common/carousel';

const CategorySlider = () => {
  const { data: categories = [], isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Default categories if no data or loading
  const defaultCategories = [
    { id: 1, name: 'Vegetables', image: 'https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
    { id: 2, name: 'Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
    { id: 3, name: 'Cold Pressed Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
    { id: 4, name: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1596306499317-8490e6d21b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
    { id: 5, name: 'Organic Juices', image: 'https://images.unsplash.com/photo-1638176865008-6639c01580b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
    { id: 6, name: 'Spices', image: 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', createdBy: 1 },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const renderCategory = (category: Category) => (
    <div key={category.id} className="flex-shrink-0 w-32 md:w-40">
      <Link href={`/category/${category.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="h-32 overflow-hidden">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-3 text-center">
          <h3 className="font-medium text-textDark">{category.name}</h3>
        </div>
      </Link>
    </div>
  );

  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-textDark">Shop by Category</h2>
        </div>

        <Carousel
          items={displayCategories}
          renderItem={renderCategory}
          className="gap-4 pb-4"
          itemClassName="flex-shrink-0 w-32 md:w-40"
        />
      </div>
    </section>
  );
};

export default CategorySlider;
