import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Package, ShoppingBag, Users, BarChart3, DollarSign, Tag, 
  BookOpen, LayoutGrid, PlusCircle, Sliders, Settings, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Product, User as UserType, Brand } from '@shared/schema';

interface Category {
  id: number;
  name: string;
  image: string;
  createdBy: number;
  description?: string;
}
import { apiRequest } from '@/lib/queryClient';
import AdminHeader from '@/components/layout/admin-header';
import AddProductModal from '@/components/modals/add-product-modal';
import AddCategoryModal from '@/components/modals/add-category-modal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  type ButtonAction = "add_product" | "add_category";
  const handleButtonClick = (action: ButtonAction) => {
    switch (action) {
      case "add_product":
        setIsAddProductModalOpen(true);
        break;
      case "add_category":
        setIsAddCategoryModalOpen(true);
        break;
      default:
        console.warn("Unhandled action:", action);
    }
  };

  // Fetch data for dashboard
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: brands = [], isLoading: isLoadingBrands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<UserType[]>({
    queryKey: ['/api/users'],
  });

  // Placeholder values for UI display
  const totalSales = 189500;
  const totalOrders = 86;
  const pendingOrders = 12;
  
  // Calculate metrics
  const buyerCount = users.filter(user => user.role === 'buyer').length;
  const sellerCount = users.filter(user => user.role === 'seller').length;
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader />
      
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleButtonClick("add_category")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
              </Button>
              <Button onClick={() => handleButtonClick("add_product")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(totalSales / 100).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +18.2% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  {categories.length} categories, {brands.length} brands
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  {buyerCount} buyers, {sellerCount} sellers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingOrders} orders pending
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Quick stats and important metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive analytics and reports will be available here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      The latest customer orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 text-sm font-medium">
                        <div>Order</div>
                        <div>Customer</div>
                        <div>Status</div>
                        <div>Amount</div>
                      </div>
                      <div className="divide-y">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-4 py-3 text-sm">
                            <div>ORD-{1000 + i}</div>
                            <div>User {i + 1}</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Delivered' : 'Processing'}
                              </span>
                            </div>
                            <div>₹{((i + 1) * 450).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>
                      Recently registered users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 text-sm font-medium">
                        <div>User</div>
                        <div>Role</div>
                        <div>Joined</div>
                      </div>
                      <div className="divide-y">
                        {users.slice(0, 5).map((user, i) => (
                          <div key={i} className="grid grid-cols-3 py-3 text-sm">
                            <div>{user.name}</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </div>
                            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Products Management</h2>
                  <p className="text-muted-foreground">Manage all products in the catalog</p>
                </div>
                <div className="flex space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search products..." className="w-full pl-8" />
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              </div>
              
              {isLoadingProducts ? (
                <div>Loading products...</div>
              ) : products.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Products</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by adding your first product</p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 p-3 text-sm font-medium bg-muted/50">
                        <div>Name</div>
                        <div>Category</div>
                        <div>Price</div>
                        <div>Stock</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      <div className="divide-y">
                        {products.slice(0, 10).map((product) => (
                          <div key={product.id} className="grid grid-cols-6 p-3 text-sm">
                            <div className="font-medium">{product.name}</div>
                            <div>{categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}</div>
                            <div>₹{(product.price / 100).toFixed(2)}</div>
                            <div>{product.stock}</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            <div className="text-right space-x-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Delete</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Categories Management</h2>
                  <p className="text-muted-foreground">Manage product categories</p>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </div>
              
              {isLoadingCategories ? (
                <div>Loading categories...</div>
              ) : categories.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Categories</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by adding your first category</p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Category
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <Card key={category.id}>
                      <CardHeader className="pb-2">
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>
                          {products.filter(p => p.categoryId === category.id).length} products
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {category.description || 'No description provided.'}
                        </p>
                        <div className="flex justify-between">
                          <Button size="sm" variant="outline">View Products</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">User Management</h2>
                  <p className="text-muted-foreground">Manage all users on the platform</p>
                </div>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              
              {isLoadingUsers ? (
                <div>Loading users...</div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 p-3 text-sm font-medium bg-muted/50">
                        <div>Name</div>
                        <div>Email</div>
                        <div>Role</div>
                        <div>Joined</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      <div className="divide-y">
                        {users.map((user) => (
                          <div key={user.id} className="grid grid-cols-6 p-3 text-sm">
                            <div className="font-medium">{user.name}</div>
                            <div>{user.email}</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'seller' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </div>
                            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                            <div>
                              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                            <div className="text-right space-x-2">
                              <Button size="sm" variant="outline">Edit</Button>
                              <Button size="sm" variant="outline">Delete</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Order Management</h2>
                  <p className="text-muted-foreground">Track and manage all orders</p>
                </div>
                <div className="flex space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search orders..." className="w-full pl-8" />
                  </div>
                  <Button variant="outline">
                    <Sliders className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-7 p-3 text-sm font-medium bg-muted/50">
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Date</div>
                      <div>Items</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-7 p-3 text-sm">
                          <div>ORD-{1000 + i}</div>
                          <div>Customer {i + 1}</div>
                          <div>{new Date().toLocaleDateString()}</div>
                          <div>{i % 5 + 1} items</div>
                          <div>₹{((i + 1) * 450).toFixed(2)}</div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 4 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              i % 4 === 1 ? 'bg-green-100 text-green-800' : 
                              i % 4 === 2 ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {i % 4 === 0 ? 'Pending' : 
                               i % 4 === 1 ? 'Delivered' : 
                               i % 4 === 2 ? 'Processing' :
                               'Cancelled'}
                            </span>
                          </div>
                          <div className="text-right space-x-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Update</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Content Management</h2>
                  <p className="text-muted-foreground">Manage website content</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Sliders</CardTitle>
                    <CardDescription>Manage home page sliders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add and edit promotional sliders for the home page
                    </p>
                    <Button>Manage Sliders</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Promotional Banners</CardTitle>
                    <CardDescription>Manage promotional banners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add and edit promotional banners across the website
                    </p>
                    <Button>Manage Banners</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>E-Books</CardTitle>
                    <CardDescription>Manage health e-books</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add and edit health e-books and guides
                    </p>
                    <Button>Manage E-Books</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboard;