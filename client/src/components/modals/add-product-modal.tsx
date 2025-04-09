import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { InsertProduct, Category, Brand } from '@shared/schema';

const AddProductModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<Partial<InsertProduct>>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    categoryId: undefined,
    brandId: undefined,
    image: '',
    stock: 0,
    isOrganic: true,
    sellerId: user?.id?.toString() || '' // Initialize as string
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
      onClose(); // Close modal after adding
      resetForm();
      // Invalidate products query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['/api/products/seller', user.id] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add product',
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
        ? parseFloat(value)
        : name === 'categoryId' || name === 'brandId'
        ? parseInt(value, 10) || undefined
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
      [name]: value === 'none' ? undefined : parseInt(value, 10)
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      categoryId: undefined, // Reset as undefined
      brandId: undefined, // Reset as undefined
      image: '',
      stock: 0,
      isOrganic: true,
      sellerId: user?.id || 0 // Reset as number
    });
  };

  // Handle add product form submission
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.categoryId) {
      toast({
        title: 'Category Required',
        description: 'Please select a category for the product',
        variant: 'destructive',
      });
      return;
    }

    // Convert price from rupees to paise
    const productData: InsertProduct = {
      ...formData as InsertProduct,
      price: Math.round((formData.price || 0) * 100),
      discountPrice: formData.discountPrice ? Math.round(formData.discountPrice * 100) : undefined,
      sellerId: user.id.toString(), // Convert to string for ObjectId
      categoryId: formData.categoryId?.toString(), // Convert to string for ObjectId
      brandId: formData.brandId?.toString(), // Convert to string for ObjectId
      stock: parseInt(formData.stock?.toString() || '0', 10)
    };

    addProductMutation.mutate(productData);
  };

  return (
    <Dialog open={isOpen}>
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
                  value={formData.discountPrice?.toString() ?? ''}
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
              
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isOrganic">Organic Product</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addProductMutation.isPending}>
              {addProductMutation.isPending ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
