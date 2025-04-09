import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, User, Product, Wishlist } from '@shared/schema';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Heart, 
  Star, 
  Clock, 
  Package,
  Truck,
  Pencil
} from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch buyer's orders
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: user ? ['/api/orders'] : [],
    enabled: !!user,
  });

  // Fetch wishlist
  const { data: wishlist = [] } = useQuery<Wishlist[]>({
    queryKey: user ? ['/api/wishlist'] : [],
    enabled: !!user,
  });

  if (!user || (user.role !== 'buyer' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to view this page
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.href = '/'}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get buyer's orders sorted by date (newest first)
  const buyerOrders = orders
    .filter(order => order.buyerId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-primary"
              onClick={() => window.location.href = '/'}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{buyerOrders.length}</div>
                  <p className="text-xs text-gray-500">
                    Lifetime purchases
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Wishlist Items</CardTitle>
                  <Heart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wishlist.length}</div>
                  <p className="text-xs text-gray-500">
                    Saved products
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                  <UserIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-md font-bold text-green-600">Active</div>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {buyerOrders.length > 0 ? (
                    <div className="space-y-4">
                      {buyerOrders.slice(0, 5).map(order => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">
                              Status: <span className={`${
                                order.status === 'delivered' ? 'text-green-600' :
                                order.status === 'processing' ? 'text-blue-600' :
                                order.status === 'pending' ? 'text-yellow-600' :
                                order.status === 'cancelled' ? 'text-red-600' :
                                'text-gray-600'
                              }`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{(order.totalPrice / 100).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-500 mb-4">
                        You haven't placed any orders yet.
                      </p>
                      <Button onClick={() => window.location.href = '/'}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p>{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p>{user.username}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p>{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p>{user.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                      <p className="text-sm">{user.address}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab('profile')}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Update Information
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  Track and manage your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                {buyerOrders.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {buyerOrders.map(order => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">₹{(order.totalPrice / 100).toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    // In a real app, this would navigate to order details page
                                    window.alert(`Viewing details for Order #${order.id}`);
                                  }}
                                >
                                  <Package className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      // In a real app, this would open a review form
                                      window.alert(`Adding review for Order #${order.id}`);
                                    }}
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                )}
                                {order.status === 'pending' && (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => {
                                      // In a real app, this would call an API to cancel the order
                                      if (confirm(`Are you sure you want to cancel Order #${order.id}?`)) {
                                        window.alert(`Order #${order.id} has been cancelled`);
                                        // Here we would make an API call to update the order status
                                        // apiRequest('PUT', `/api/orders/${order.id}`, { status: 'cancelled' });
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Order History</h3>
                    <p className="text-gray-500 mb-4">
                      You haven't placed any orders yet.
                    </p>
                    <Button>
                      Browse Products
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Tracking</CardTitle>
                  <CardDescription>Track your recent orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {buyerOrders.filter(o => o.status === 'processing' || o.status === 'shipped').length > 0 ? (
                    <div className="space-y-6">
                      {buyerOrders
                        .filter(o => o.status === 'processing' || o.status === 'shipped')
                        .slice(0, 3)
                        .map(order => (
                          <div key={order.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-medium">Order #{order.id}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="relative mb-6">
                              <div className="flex mb-2 items-center justify-between">
                                <div className="z-10 flex items-center justify-center w-6 h-6 bg-primary rounded-full text-white text-xs">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="z-10 flex items-center justify-center w-6 h-6 bg-primary rounded-full text-white text-xs">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className={`z-10 flex items-center justify-center w-6 h-6 ${
                                  order.status === 'shipped' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                                } rounded-full text-xs`}>
                                  {order.status === 'shipped' ? (
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <span>3</span>
                                  )}
                                </div>
                                <div className="z-10 flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-400 rounded-full text-xs">
                                  <span>4</span>
                                </div>
                              </div>
                              <div className="absolute left-0 top-3 w-full h-0.5 bg-gray-200">
                                <div className={`h-0.5 bg-primary ${order.status === 'shipped' ? 'w-2/3' : 'w-1/3'}`}></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Order Placed</span>
                                <span>Processing</span>
                                <span>Shipped</span>
                                <span>Delivered</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm text-gray-500">Ordered on</p>
                                <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="self-end"
                                onClick={() => {
                                  // In a real app, this would navigate to a tracking page
                                  window.alert(`Tracking Order #${order.id}`);
                                }}
                              >
                                <Truck className="h-4 w-4 mr-1" />
                                Track Order
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No orders currently being processed or shipped
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Username</p>
                        <p className="font-medium">{user.username}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Default Shipping Address</p>
                      <p>{user.address}</p>
                    </div>
                    
                    <Button variant="outline" className="mt-4">
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Password</p>
                      <p className="font-medium">••••••••</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Login</p>
                      <p className="font-medium">Today, {new Date().toLocaleTimeString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Created</p>
                      <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <Button variant="outline" className="mt-4">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Wishlist Items</CardTitle>
                  <CardDescription>
                    Products you've saved for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wishlist.length > 0 ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {/* This would normally fetch wishlist products */}
                      <div className="text-center p-4">
                        <p className="text-gray-500">Wishlist items would appear here</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
                      <p className="text-gray-500 mb-4">
                        Save your favorite products to come back to them later.
                      </p>
                      <Button onClick={() => window.location.href = '/'}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default BuyerDashboard;
