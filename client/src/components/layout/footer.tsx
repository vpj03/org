import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Map, Phone, Mail, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15" />
              </svg>
              <span className="ml-2 text-xl font-bold font-heading">OrgPick</span>
            </div>
            <p className="text-gray-400 mb-4">Your trusted source for certified organic products delivered direct to your door.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-heading mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Shop All</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Organic Certification</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Health E-books</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Become a Seller</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-heading mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Shipping Policy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Returns & Refunds</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-heading mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Map className="h-5 w-5 mt-1 mr-3 text-gray-400" />
                <span className="text-gray-400">123 Organic Way, Green Valley, Eco City - 500001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-gray-400">+91 1234567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span className="text-gray-400">support@orgpick.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">We Accept</h4>
              <div className="flex space-x-3">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <CreditCard className="h-6 w-6 text-gray-400" />
                <CreditCard className="h-6 w-6 text-gray-400" />
                <CreditCard className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 OrgPick. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
