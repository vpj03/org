import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Package, ShoppingBag, Users, BarChart3, Truck, CreditCard, PlusCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import SellerHeader from '@/components/layout/seller-header';
import AddProductModal from '@/components/modals/add-product-modal';
import AddCategoryModal from '@/components/modals/add-category-modal';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  // Fetch seller's products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: user?.id ? ['/api/products/seller', user.id] : [], // Correct query key
    enabled: !!user?.id,
  });

  // Fetch seller's orders (Placeholder - needs API endpoint)
  // const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
  //   queryKey: user?.id ? ['/api/orders/seller', user.id] : [],
  //   enabled: !!user?.id,
  // });

  // Fetch seller's categories (Placeholder - might not be needed directly here)
  // const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
  //   queryKey: ['/api/categories'], // Assuming seller might need category info
  // });

  // Handle button clicks for modals
  const handleButtonClick = (action: "add_product" | "add_category") => {
    switch (action) {
      case "add_product":
        setIsAddProductModalOpen(true);
        break;
      case "add_category":
        setIsAddCategoryModalOpen(true);
        break;
    }
  };

  // Dummy data for UI display - Replace with actual fetched data
  const totalSales = 12560; // Replace with calculation from fetched orders
  const totalOrders = 28; // Replace with fetched orders count
  const pendingOrders = 5; // Replace with filtered fetched orders count
  const totalCustomers = 16; // Replace with fetched customer data count (needs API)
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SellerHeader />
      
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                View Orders
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleButtonClick("add_category")}>
                  <Tag className="mr-2 h-4 w-4" />
                  Manage Categories
                </Button>
                <Button onClick={() => handleButtonClick("add_product")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(totalSales / 100).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoadingProducts ? '...' : products.length}</div> {/* Use fetched data */}
                <p className="text-xs text-muted-foreground">
                  {isLoadingProducts ? '...' : products.filter(p => p.stock < 10).length} products low in stock
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{/*isLoadingOrders ? '...' :*/ totalOrders}</div> {/* Use fetched data */}
                <p className="text-xs text-muted-foreground">
                  {/*isLoadingOrders ? '...' :*/ pendingOrders} orders pending
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new customers this week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    You have {pendingOrders} pending orders to process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 text-sm font-medium">
                      <div>Order ID</div>
                      <div>Customer</div>
                      <div>Status</div>
                      <div>Amount</div>
                    </div>
                    <div className="divide-y">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-4 py-3 text-sm">
                          <div>ORD-{1000 + i}</div>
                          <div>Customer {i + 1}</div>
                          <div>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Delivered' : 'Processing'}
                            </span>
                          </div>
                          <div>₹{((i + 1) * 150).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">View All Orders</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Your Products</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => handleButtonClick("add_category")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Categories
                  </Button>
                  <Button onClick={() => handleButtonClick("add_product")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Product
                  </Button>
                </div>
              </div>
              
              {isLoadingProducts ? (
                <div>Loading products...</div>
              ) : products.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Products Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">Start selling by adding your first product</p>
                    <Button onClick={() => handleButtonClick("add_product")}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image || "https://placehold.co/400x400?text=No+Image"} 
                          alt={product.name}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm">Price: ₹{(product.price / 100).toFixed(2)}</p>
                          <p className="text-sm">Stock: {product.stock}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="w-full">Edit</Button>
                          <Button size="sm" variant="outline" className="w-full">Manage</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    Track and manage all your customer orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">All Orders</Button>
                      <Button variant="outline" size="sm">Pending</Button>
                      <Button variant="outline" size="sm">Processing</Button>
                      <Button variant="outline" size="sm">Delivered</Button>
                      <Button variant="outline" size="sm">Cancelled</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-muted/50 p-3 text-sm font-medium">
                        <div>Order ID</div>
                        <div>Customer</div>
                        <div>Date</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      <div className="divide-y">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="grid grid-cols-5 p-3 text-sm">
                            <div>ORD-{1000 + i}</div>
                            <div>Customer {i + 1}</div>
                            <div>{new Date().toLocaleDateString()}</div>
                            <div>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                                i % 3 === 1 ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Delivered' : 'Processing'}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">View</Button>
                              <Button size="sm" variant="outline">Update</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>
                    Track your sales performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed sales analytics will be available in the next update
                    </p>
                  </div>
                </CardContent>
              </Card>
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

export default SellerDashboard;