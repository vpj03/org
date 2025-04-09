import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

interface InsertCategory {
  name: string;
  description: string;
  image: string;
  createdBy: string; // Ensure this matches backend expectation (string for ObjectId)
}

const AddCategoryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<Partial<InsertCategory>>({
    name: '',
    description: '',
    image: '',
    createdBy: user?.id?.toString() || '' // Initialize as string
  });

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: InsertCategory) => {
      const res = await apiRequest('POST', '/api/categories', categoryData);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create category");
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Category added',
        description: 'Your category has been added successfully.',
      });
      onClose(); // Close modal after adding
      resetForm();
      // Invalidate categories query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add category',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      createdBy: user?.id?.toString() || '' // Reset as string
    });
  };

  // Handle add category form submission
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove the guard and assign a fallback if user is missing
    const categoryData: InsertCategory = {
      ...formData as InsertCategory,
      createdBy: user?.id?.toString() || 'admin'
    };
    addCategoryMutation.mutate(categoryData);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new category.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddCategory}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
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
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={addCategoryMutation.isLoading}>
              {addCategoryMutation.isLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;