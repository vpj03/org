import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { 
  Apple, 
  Carrot, 
  FlaskConical, 
  Leaf, 
  GlassWater, 
  Flame,
  Grid
} from 'lucide-react';

const CategoryList = () => {
  // Fetch categories from the API
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

  // Function to get appropriate icon for a category
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('vegetable')) return <Carrot className="mr-3 w-6 h-6 text-center text-primary" />;
    if (name.includes('fruit')) return <Apple className="mr-3 w-6 h-6 text-center text-primary" />;
    if (name.includes('oil')) return <FlaskConical className="mr-3 w-6 h-6 text-center text-primary" />;
    if (name.includes('dry')) return <Leaf className="mr-3 w-6 h-6 text-center text-primary" />;
    if (name.includes('juice')) return <GlassWater className="mr-3 w-6 h-6 text-center text-primary" />;
    if (name.includes('spice')) return <Flame className="mr-3 w-6 h-6 text-center text-primary" />;
    return <Grid className="mr-3 w-6 h-6 text-center text-primary" />;
  };

  return (
    <ul>
      {displayCategories.map((category) => (
        <li key={category.id} className="mb-2">
          <Link href={`/category/${category.id}`} className="flex items-center py-2 hover:text-primary">
            {getCategoryIcon(category.name)}
            {category.name}
          </Link>
        </li>
      ))}
      <li className="mb-2">
        <Link href="/categories" className="flex items-center py-2 hover:text-primary">
          <Grid className="mr-3 w-6 h-6 text-center text-primary" />
          All Categories
        </Link>
      </li>
    </ul>
  );
};

export default CategoryList;