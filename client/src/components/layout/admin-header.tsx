import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  Package, ShoppingBag, Users, BarChart3, LogOut, User, 
  Bell, Settings, LayoutDashboard, BookOpen, LayoutGrid 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SettingsModal from '@/components/modals/settings-modal';

const AdminHeader = () => {
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigateTo = (path: string) => {
    window.location.href = path; // Navigate to the specified path
  };

  return (
    <header className="sticky top-0 z-10 bg-primary text-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">OrgPick Admin</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/products')}>
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/categories')}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Categories
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/orders')}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/users')}>
              <Users className="mr-2 h-4 w-4" />
              Users
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/content')}>
              <BookOpen className="mr-2 h-4 w-4" />
              Content
            </Button>
            <Button variant="ghost" className="text-sm font-medium text-white hover:bg-primary-foreground/10" onClick={() => navigateTo('/admin/analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </nav>

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-primary-foreground/10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-amber-500"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'Administrator'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
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
              className="md:hidden text-white"
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
        <div className="fixed inset-0 z-50 bg-primary md:hidden">
          <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between p-4 border-b border-primary-foreground/10">
              <span className="text-xl font-bold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white p-2"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 px-4 py-8 space-y-6 overflow-y-auto">
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin'); }}>
                <LayoutDashboard className="mr-3 h-6 w-6" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/products'); }}>
                <Package className="mr-3 h-6 w-6" />
                Products
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/categories'); }}>
                <LayoutGrid className="mr-3 h-6 w-6" />
                Categories
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/orders'); }}>
                <ShoppingBag className="mr-3 h-6 w-6" />
                Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/users'); }}>
                <Users className="mr-3 h-6 w-6" />
                Users
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/content'); }}>
                <BookOpen className="mr-3 h-6 w-6" />
                Content
              </Button>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium text-white hover:bg-primary-foreground/10 py-4" onClick={() => { setIsMobileMenuOpen(false); navigateTo('/admin/analytics'); }}>
                <BarChart3 className="mr-3 h-6 w-6" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      )}
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </header>
  );
};

export default AdminHeader;