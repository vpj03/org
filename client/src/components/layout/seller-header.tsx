import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Package, ShoppingBag, BarChart3, User, LogOut, Tag, Bell, Settings, Users } from 'lucide-react';
import SettingsModal from '@/components/modals/settings-modal';

const SellerHeader = () => {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const header = (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15" />
              </svg>
              <span className="ml-2 text-xl font-bold text-primary">OrgPick Seller</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/seller">
              <Button variant="ghost" className="text-sm font-medium">
                Dashboard
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button variant="ghost" className="text-sm font-medium">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/seller/categories">
              <Button variant="ghost" className="text-sm font-medium">
                <Tag className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Link href="/seller/orders">
              <Button variant="ghost" className="text-sm font-medium">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link href="/seller/customers">
              <Button variant="ghost" className="text-sm font-medium">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </Link>
            <Link href="/seller/analytics">
              <Button variant="ghost" className="text-sm font-medium">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/seller/register">
              <Button variant="ghost" className="text-sm font-medium">
                Register as Seller
              </Button>
            </Link>
          </nav>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link href="/seller">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                Dashboard
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
            </Link>
            <Link href="/seller/categories">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                <Tag className="mr-2 h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Link href="/seller/orders">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
            </Link>
            <Link href="/seller/customers">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
            </Link>
            <Link href="/seller/analytics">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
            <Link href="/seller/register">
              <Button variant="ghost" className="w-full justify-start text-sm font-medium">
                Register as Seller
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );

  return (
    <>
      {header}
      {/* Settings Modal */}
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  );
};

export default SellerHeader;