import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Product, Category, Brand, HeroSlider, PromoAd, Ebook, Order } from '@shared/schema';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Truck, 
  MessageSquare,
  BarChart,
  PlusCircle,
  Pencil,
  Trash2,
  ImagePlus,
  BookOpen,
  Tag,
  Layers
} from 'lucide-react';
import AddCategoryModal from '@/components/modals/add-category-modal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  type ButtonAction = "add_product" | "add_category";
  const handleButtonClick = (action: ButtonAction) => {
    switch (action) {
      case "add_product":
        alert("Add Product functionality coming soon!");
        break;
      case "add_category":
        setIsAddCategoryModalOpen(true);
        break;
      default:
        console.warn("Unhandled action:", action);
    }
  };
  
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });
  
  const { data: heroSliders = [] } = useQuery<HeroSlider[]>({
    queryKey: ['/api/hero-sliders/all'],
  });
  
  const { data: promoAds = [] } = useQuery<PromoAd[]>({
    queryKey: ['/api/promo-ads/all'],
  });
  
  const { data: ebooks = [] } = useQuery<Ebook[]>({
    queryKey: ['/api/ebooks'],
  });

  // Count of different entities
  const userCount = users.length;
  const buyerCount = users.filter(u => u.role === 'buyer').length;
  const sellerCount = users.filter(u => u.role === 'seller').length;
  const productCount = products.length;
  const orderCount = orders.length;
  const pendingOrderCount = orders.filter(o => o.status === 'pending').length;
  
  if (!user || user.role !== 'admin') {
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-primary" onClick={() => handleButtonClick("add_product")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userCount}</div>
                  <p className="text-xs text-gray-500">
                    Buyers: {buyerCount}, Sellers: {sellerCount}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productCount}</div>
                  <p className="text-xs text-gray-500">
                    Active Products
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orderCount}</div>
                  <p className="text-xs text-gray-500">
                    Pending: {pendingOrderCount}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <BarChart className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(orders.reduce((sum, order) => sum + order.totalPrice, 0) / 100).toFixed(2)}</div>
                  <p className="text-xs text-gray-500">
                    All time revenue
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(order => (
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium capitalize">{user.role}</p>
                          <p className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all registered users on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>
                    Manage all products on the platform
                  </CardDescription>
                </div>
                <Button onClick={() => handleButtonClick("add_product")}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">
                                  {product.isOrganic ? 'Organic' : 'Non-Organic'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.discountPrice ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">₹{(product.discountPrice / 100).toFixed(2)}</div>
                                <div className="text-sm text-gray-500 line-through">₹{(product.price / 100).toFixed(2)}</div>
                              </div>
                            ) : (
                              <div className="text-sm font-medium text-gray-900">₹{(product.price / 100).toFixed(2)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{product.stock}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Seller ID: {product.sellerId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  Track and manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">Customer ID: {order.buyerId}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{order.address}</div>
                          </td>
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
                              <Button variant="outline" size="sm">
                                <Truck className="h-4 w-4 mr-1" />
                                Update
                              </Button>
                              <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Hero Sliders</CardTitle>
                    <CardDescription>Manage homepage hero sliders</CardDescription>
                  </div>
                  <Button>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {heroSliders.map(slider => (
                      <div key={slider.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-16 w-24 overflow-hidden rounded-md mr-4">
                            <img src={slider.image} alt={slider.title} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{slider.title}</h4>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{slider.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Promo Ads</CardTitle>
                    <CardDescription>Manage promotional advertisements</CardDescription>
                  </div>
                  <Button>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {promoAds.map(ad => (
                      <div key={ad.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-16 w-24 overflow-hidden rounded-md mr-4">
                            <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{ad.title}</h4>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{ad.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>E-books</CardTitle>
                    <CardDescription>Manage health e-books content</CardDescription>
                  </div>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ebooks.map(ebook => (
                      <div key={ebook.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-16 w-24 overflow-hidden rounded-md mr-4">
                            <img src={ebook.image} alt={ebook.title} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{ebook.title}</h4>
                            <p className="text-sm text-gray-500">By {ebook.author}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Categories Management</h2>
                <p className="text-muted-foreground">Manage product categories</p>
              </div>
              <Button onClick={() => handleButtonClick("add_category")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage product categories</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 overflow-hidden rounded-md mr-4">
                            <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Brands</CardTitle>
                    <CardDescription>Manage product brands</CardDescription>
                  </div>
                  <Button>
                    <Layers className="h-4 w-4 mr-2" />
                    Add Brand
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 overflow-hidden rounded-md mr-4">
                            <img src={brand.image} alt={brand.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium">{brand.name}</h4>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View platform statistics and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">User Demographics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Buyers</span>
                        <span>{buyerCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(buyerCount / userCount) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span>Sellers</span>
                        <span>{sellerCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${(sellerCount / userCount) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span>Admins</span>
                        <span>{userCount - buyerCount - sellerCount}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${((userCount - buyerCount - sellerCount) / userCount) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Order Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pending</span>
                        <span>{orders.filter(o => o.status === 'pending').length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(orders.filter(o => o.status === 'pending').length / orderCount) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span>Processing</span>
                        <span>{orders.filter(o => o.status === 'processing').length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(orders.filter(o => o.status === 'processing').length / orderCount) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span>Delivered</span>
                        <span>{orders.filter(o => o.status === 'delivered').length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(orders.filter(o => o.status === 'delivered').length / orderCount) * 100}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between mt-4">
                        <span>Cancelled</span>
                        <span>{orders.filter(o => o.status === 'cancelled').length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${(orders.filter(o => o.status === 'cancelled').length / orderCount) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Product Categories</h3>
                    <div className="space-y-4">
                      {categories.map(category => {
                        const count = products.filter(p => p.categoryId === category.id).length;
                        return (
                          <div key={category.id}>
                            <div className="flex justify-between">
                              <span>{category.name}</span>
                              <span>{count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(count / productCount) * 100}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
