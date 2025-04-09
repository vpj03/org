import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu,
  Globe,
  LogOut,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "@/components/layout/mobile-menu";
import CategoryMenu from "@/components/layout/category-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Hide header on scroll down
      } else {
        setIsVisible(true); // Show header on scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-header text-white shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top navigation bar */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo and Menu */}
          <div className="flex items-center">
            <button 
              onClick={handleMobileMenuToggle}
              className="lg:hidden mr-4 text-white header-button"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white font-heading">OrgPick</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for organic products..." 
                className="w-full px-4 py-2 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="absolute right-0 top-0 h-full header-button">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <Link 
                href={user.role === "admin" ? "/admin" : (user.role === "seller" ? "/seller" : "/buyer")}
                className="hidden md:flex items-center mx-2 header-button"
                aria-label={`Profile: ${user.name}`}
              >
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link href="/auth" className="hidden md:flex items-center mx-2 header-button rounded-full px-3 py-1" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            )}
            
            <Link href="/wishlist" className="flex items-center mx-2 header-button rounded-full px-3 py-1 relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-accent text-amber-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">{wishlistCount || 0}</span>
            </Link>
            
            <Link 
              href="/seller/register" 
              className="flex items-center mx-2 header-button rounded-full px-3 py-1"
              aria-label="Start Selling"
            >
              <Store className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Start Selling</span>
            </Link>

            {/* Updated cart link */}
            {(!isAuthenticated || user.role === "buyer") && (
              <Link 
                href={isAuthenticated ? "/buyer/cart" : "/cart"}
                className="flex items-center mx-2 header-button rounded-full px-3 py-1 relative" 
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-accent text-amber-800 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount || 0}
                </span>
              </Link>
            )}
            
            {isAuthenticated && user.role === "seller" && (
              <Link 
                href="/seller/dashboard" 
                className="flex items-center mx-2 header-button"
                aria-label="Selling Dashboard"
              >
                <Store className="h-5 w-5" />
              </Link>
            )}

            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="ml-2 hidden md:inline-flex header-button rounded-full px-3 py-1"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
            <div className="ml-2">
              <button
                onClick={() => {
                  // Define the initialization function in the global scope
                  (window as any).googleTranslateElementInit = () => {
                    new (window as any).google.translate.TranslateElement(
                      { pageLanguage: "en", includedLanguages: "en,es,fr,de,it,zh" },
                      "google_translate_element"
                    );
                  };

                  // Check if the script is already loaded
                  if (!(window as any).google || !(window as any).google.translate) {
                    const script = document.createElement("script");
                    script.src =
                      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
                    script.async = true;
                    document.body.appendChild(script);
                  } else {
                    // If already loaded, just call the init function
                    (window as any).googleTranslateElementInit();
                  }
                  document.getElementById("google_translate_element")?.classList.remove("hidden");
                }}
                className="flex items-center header-button rounded-full px-3 py-1"
                aria-label="Translate page"
              >
                <Globe className="h-5 w-5" />
              </button>
              <div id="google_translate_element" className="hidden mt-2"></div>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-2 md:hidden">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for organic products..." 
              className="w-full px-4 py-2 rounded-full border border-gray-300 text-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button className="absolute right-0 top-0 h-full header-button">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <CategoryMenu />

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Header;
