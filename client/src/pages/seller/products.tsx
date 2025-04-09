import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import SellerHeader from '@/components/layout/seller-header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product, Category, Brand, InsertProduct } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Search,
  Filter,
  ArrowUpDown,
  X
} from 'lucide-react';

const SellerProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    categoryId: '', // Initialize as string
    brandId: '', // Initialize as string
    image: '',
    stock: 0,
    isOrganic: true,
    sellerId: user?.id?.toString() || '' // Initialize as string
  });

  // Fetch seller's products
  const { data: products = [], refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: user ? ['/api/products/seller', user.id] : [],
    enabled: !!user,
  });
  
  // Fetch categories and brands for product management
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: brands = [] } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const res = await apiRequest('POST', '/api/products', productData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product added',
        description: 'Your product has been added successfully.',
      });
      setIsAddProductOpen(false);
      resetForm();
      refetchProducts();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertProduct> }) => {
      const res = await apiRequest('PUT', `/api/products/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Product updated',
        description: 'Your product has been updated successfully.',
      });
      setIsEditProductOpen(false);
      resetForm();
      refetchProducts();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: 'Product deleted',
        description: 'Your product has been deleted successfully.',
      });
      refetchProducts();
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Keep categoryId and brandId as strings
      [name]: (name === 'price' || name === 'discountPrice' || name === 'stock')
        ? parseFloat(value) // Use parseFloat for price/discount, parseInt for stock
        : value
    }));
  };

  // Handle switch input change
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isOrganic: checked
    }));
  };

  // Handle select input change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value // Value is already a string
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      categoryId: '', // Reset as string
      brandId: '', // Reset as string
      image: '',
      stock: 0,
      isOrganic: true,
      sellerId: user?.id?.toString() || '' // Reset as string
    });
    setCurrentProduct(null);
  };

  // Handle add product form submission
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Convert price from rupees to paise
    const productData: InsertProduct = {
      ...formData as InsertProduct,
      price: Math.round((formData.price || 0) * 100),
      discountPrice: formData.discountPrice ? Math.round(formData.discountPrice * 100) : undefined,
      sellerId: user.id.toString(), // Ensure sellerId is string
      // categoryId and brandId are already strings from state
      categoryId: formData.categoryId || undefined, // Send undefined if empty
      brandId: formData.brandId || undefined, // Send undefined if empty
      stock: parseInt(formData.stock?.toString() || '0', 10)
    };

    addProductMutation.mutate(productData);
  };

  // Handle edit product form submission
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    // Convert price from rupees to paise
    const productData: Partial<InsertProduct> = {
      ...formData,
      price: Math.round((formData.price || 0) * 100),
      discountPrice: formData.discountPrice ? Math.round(formData.discountPrice * 100) : undefined,
      // categoryId and brandId are already strings from state
      categoryId: formData.categoryId || undefined, // Send undefined if empty
      brandId: formData.brandId || undefined, // Send undefined if empty
      stock: parseInt(formData.stock?.toString() || '0', 10)
    };

    // Ensure ID is passed correctly (assuming currentProduct.id is the correct type)
    updateProductMutation.mutate({ id: currentProduct.id, data: productData });
  };

  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // Open edit product dialog
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price / 100, // Convert from paise to rupees for display
      discountPrice: product.discountPrice ? product.discountPrice / 100 : 0,
      categoryId: product.categoryId?.toString() || '', // Ensure it's a string for the Select
      brandId: product.brandId?.toString() || '', // Ensure it's a string for the Select
      image: product.image,
      stock: product.stock,
      isOrganic: product.isOrganic,
      sellerId: product.sellerId.toString() // Ensure sellerId is string
    });
    setIsEditProductOpen(true);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? product.categoryId.toString() === filterCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc' 
          ? a.price - b.price 
          : b.price - a.price;
      } else { // stock
        return sortOrder === 'asc' 
          ? a.stock - b.stock 
          : b.stock - a.stock;
      }
    });

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
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
      <SellerHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your product listings</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              className="bg-primary"
              onClick={() => {
                resetForm();
                setIsAddProductOpen(true);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'price' | 'stock')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-10 w-10"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>
              You have {products.length} products in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length > 0 ? (
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map(product => {
                      const category = categories.find(c => c.id === product.categoryId);
                      return (
                        <tr key={product.id}>
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
                            <div className={`text-sm text-gray-900 ${product.stock < 10 ? 'text-red-500 font-semibold' : ''}`}>
                              {product.stock}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{category?.name || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(product)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterCategory 
                    ? 'No products match your search criteria. Try adjusting your filters.'
                    : 'You haven\'t added any products yet.'}
                </p>
                {!searchTerm && !filterCategory && (
                  <Button onClick={() => setIsAddProductOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your inventory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                  <Input
                    id="discountPrice"
                    name="discountPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountPrice || ''} // Ensure a default value is provided
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select 
                    value={formData.categoryId?.toString() || ''} // Ensure value is string
                    onValueChange={(value) => handleSelectChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="brandId">Brand</Label>
                  <Select 
                    value={formData.brandId?.toString() || ''} // Ensure value is string
                    onValueChange={(value) => handleSelectChange('brandId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Brand</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="isOrganic">Organic Product</Label>
                  <Switch
                    id="isOrganic"
                    checked={formData.isOrganic}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addProductMutation.isPending}>
                {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details of your product.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProduct}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-discountPrice">Discount Price (₹)</Label>
                  <Input
                    id="edit-discountPrice"
                    name="discountPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountPrice || ''} // Ensure a default value is provided
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-categoryId">Category</Label>
                  <Select 
                    value={formData.categoryId?.toString() || ''} // Ensure value is string
                    onValueChange={(value) => handleSelectChange('categoryId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-brandId">Brand</Label>
                  <Select 
                    value={formData.brandId?.toString() || ''} // Ensure value is string
                    onValueChange={(value) => handleSelectChange('brandId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Brand</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="edit-isOrganic">Organic Product</Label>
                  <Switch
                    id="edit-isOrganic"
                    checked={formData.isOrganic}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditProductOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default SellerProducts;