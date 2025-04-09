import { useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, Heart, User2, History, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductCard from '@/components/common/product-card';
import { Product } from '@shared/schema';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch products for recommendations
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Placeholder values for UI display
  const orderCount = 5;
  const wishlistCount = 8;
  const cartCount = 2;
  
  // Get a subset of products for recommendations
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-gray-600">Manage your orders, wishlist, and account details</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/buyer/cart">
                <Button variant="outline">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Cart
                </Button>
              </Link>
              <Button variant="link" className="px-0 mt-2" onClick={() => setActiveTab('orders')}>
                Manage Orders <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderCount}</div>
                <p className="text-xs text-muted-foreground">
                  2 orders in progress
                </p>
                <Button variant="link" className="px-0 mt-2">
                  Manage Orders <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{wishlistCount}</div>
                <p className="text-xs text-muted-foreground">
                  3 items on sale!
                </p>
                <Button variant="link" className="px-0 mt-2">
                  View Wishlist <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Cart</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cartCount}</div>
                <p className="text-xs text-muted-foreground">
                  Items waiting for checkout
                </p>
                <Link href="/buyer/cart">
                  <Button variant="link" className="px-0 mt-2">
                    Go to Cart <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-md font-medium truncate">{user?.email || 'user@example.com'}</div>
                <p className="text-xs text-muted-foreground">
                  Member since {new Date().toLocaleDateString()}
                </p>
                <Button variant="link" className="px-0 mt-2">
                  Edit Profile <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>
                    Based on your previous purchases and browsing history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="text-center py-4">Loading products...</div>
                  ) : recommendedProducts.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No recommendations available at this time.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {recommendedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="w-full sm:w-auto">
                      View All Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Your order history and tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 md:grid-cols-4 text-sm font-medium">
                      <div>Order ID</div>
                      <div className="hidden md:block">Date</div>
                      <div>Status</div>
                      <div>Amount</div>
                    </div>
                    <div className="divide-y">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-3 md:grid-cols-4 py-3 text-sm">
                          <div>ORD-{1000 + i}</div>
                          <div className="hidden md:block">{new Date().toLocaleDateString()}</div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Processing' : 'Shipped'}
                            </span>
                          </div>
                          <div>₹{((i + 1) * 450).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">View All Orders</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>
                    Track and manage your purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2 mb-4">
                      <Button variant="outline" size="sm">All Orders</Button>
                      <Button variant="outline" size="sm">Processing</Button>
                      <Button variant="outline" size="sm">Shipped</Button>
                      <Button variant="outline" size="sm">Delivered</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                        <div>Order ID</div>
                        <div>Date</div>
                        <div>Products</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-5 p-3 text-sm">
                            <div>ORD-{1000 + i}</div>
                            <div>{new Date().toLocaleDateString()}</div>
                            <div>({i + 1}) items</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {i % 3 === 0 ? 'Delivered' : i % 3 === 1 ? 'Processing' : 'Shipped'}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">Details</Button>
                              <Button size="sm" variant="outline">Track</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="wishlist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>
                    Products you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProducts ? (
                    <div className="text-center py-4">Loading wishlist...</div>
                  ) : products.length === 0 ? (
                    <div className="text-center py-10">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your Wishlist is Empty</h3>
                      <p className="text-sm text-muted-foreground mb-4">Browse our products and add items to your wishlist</p>
                      <Button>
                        Explore Products
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 6).map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <div className="aspect-[4/3] relative">
                            <img 
                              src={product.image || "https://placehold.co/400x300?text=No+Image"} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                            <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md text-red-500">
                              <Heart className="h-4 w-4 fill-current" />
                            </button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium line-clamp-1">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-semibold text-primary">₹{(product.price / 100).toFixed(2)}</p>
                              <Button size="sm">
                                <ShoppingBag className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Personal Information</h3>
                      <div className="border rounded-md p-3 space-y-1">
                        <p><span className="text-sm text-muted-foreground">Name:</span> {user?.name || 'User Name'}</p>
                        <p><span className="text-sm text-muted-foreground">Email:</span> {user?.email || 'user@example.com'}</p>
                        <p><span className="text-sm text-muted-foreground">Phone:</span> {user?.phone || '+91 1234567890'}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        Edit Information
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Default Address</h3>
                      <div className="border rounded-md p-3 space-y-1">
                        <p>{user?.name || 'User Name'}</p>
                        <p>{user?.address || '123 Main Street, Apartment 4B'}</p>
                        <p>{user?.address ? '' : 'City, State 123456'}</p>
                        <p>{user?.phone || '+91 1234567890'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit Address
                        </Button>
                        <Button size="sm" variant="outline">
                          Add New Address
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Account Security</h3>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-muted-foreground">For your security, we recommend changing your password regularly.</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default BuyerDashboard;