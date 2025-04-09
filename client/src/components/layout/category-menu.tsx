import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Category } from '@shared/schema';
import { ChevronDown } from 'lucide-react';
import '@/styles/colors.css';

interface CategoryMenuProps {
  className?: string;
}

const CategoryMenu = ({ className = '' }: CategoryMenuProps) => {
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

  return (
    <nav className={`green-tea-dark text-white ${className}`}>
      <div className="container mx-auto px-4">
        <ul className="hidden lg:flex items-center justify-between py-2 text-sm font-medium">
          {displayCategories.map((category) => (
            <li key={category.id} className="hover-green-tea-medium px-4 py-2 rounded transition-colors duration-200">
              <Link href={`/category/${category.id}`} className="flex items-center">
                <span>{category.name}</span>
              </Link>
            </li>
          ))}
          {displayCategories.length > 0 && (
            <li className="hover-green-tea-medium px-4 py-2 rounded transition-colors duration-200">
              <Link href="/categories" className="flex items-center">
                <span>All Categories</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default CategoryMenu;