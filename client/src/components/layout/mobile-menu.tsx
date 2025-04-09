import { FC, useState } from 'react';
import { Link } from 'wouter';
import { User } from '@shared/schema';
import { 
  X, 
  User as UserIcon, 
  Flame,
  Zap,
  UserCircle,
  HelpCircle,
  ShoppingCart,
  Heart,
  Leaf,
  Settings
} from 'lucide-react';
import SettingsModal from '@/components/modals/settings-modal';
import CategoryList from './category-list';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: Omit<User, 'password'> | null;
  onLogout: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose, user, onLogout }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto lg:hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15"/>
            </svg>
            <span className="ml-2 text-xl font-bold text-primary font-heading">OrgPick</span>
          </Link>
          <button onClick={onClose} className="text-gray-700" aria-label="Close menu">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-4 border-b">
        {user ? (
          <div className="flex flex-col">
            <div className="flex items-center text-gray-700 mb-2">
              <UserIcon className="mr-3 w-6 h-6 text-center text-primary" />
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2 pl-9">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Account
            </div>
            <Button 
              onClick={onLogout}
              variant="outline" 
              size="sm"
              className="ml-9 mt-2 w-24"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/auth" className="flex items-center text-gray-700 mb-4">
            <UserIcon className="mr-3 w-6 h-6 text-center text-primary" />
            <span>Sign In / Register</span>
          </Link>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-bold mb-2 text-gray-700">Categories</h3>
        <CategoryList />
      </div>
      
      <div className="p-4 border-t">
        <h3 className="font-bold mb-2 text-gray-700">Trending</h3>
        <ul>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary">
              <Flame className="mr-3 w-6 h-6 text-center text-accent" />
              Bestsellers
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary">
              <Leaf className="mr-3 w-6 h-6 text-center text-secondary" />
              New Releases
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary">
              <Zap className="mr-3 w-6 h-6 text-center text-accent" />
              Movers and Shakers
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="p-4 border-t">
        <h3 className="font-bold mb-2 text-gray-700">Help & Settings</h3>
        <ul>
          <li className="mb-2">
            <Link 
              href={user ? (user.role === 'admin' ? '/admin' : (user.role === 'seller' ? '/seller' : '/buyer')) : '/auth'} 
              className="flex items-center py-2 hover:text-primary"
            >
              <UserCircle className="mr-3 w-6 h-6 text-center" />
              Your Account
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary relative">
              <ShoppingCart className="mr-3 w-6 h-6 text-center" />
              Cart
              <span className="absolute top-1 left-5 bg-accent text-amber-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">0</span>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary">
              <Heart className="mr-3 w-6 h-6 text-center" />
              Wishlist
            </Link>
          </li>
          <li className="mb-2">
            <Link href="#" className="flex items-center py-2 hover:text-primary">
              <HelpCircle className="mr-3 w-6 h-6 text-center" />
              Customer Service
            </Link>
          </li>
          <li className="mb-2">
            <button 
              onClick={() => setIsSettingsOpen(true)} 
              className="flex items-center py-2 hover:text-primary w-full text-left"
            >
              <Settings className="mr-3 w-6 h-6 text-center" />
              Settings
            </button>
          </li>
        </ul>
      </div>
      
      {/* Settings Modal */}
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
};

export default MobileMenu;
