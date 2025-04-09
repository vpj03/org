import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HeroSlider, PromoAd } from '@shared/schema';
import { 
  ImagePlus, Search, PlusCircle, Trash2, Edit, MoreHorizontal, Filter, Image, 
  Layers, LayoutGrid, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AdminHeader from '@/components/layout/admin-header';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const ContentPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero-sliders');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [isAddHeroSliderOpen, setIsAddHeroSliderOpen] = useState(false);
  const [isEditHeroSliderOpen, setIsEditHeroSliderOpen] = useState(false);
  const [isAddPromoAdOpen, setIsAddPromoAdOpen] = useState(false);
  const [isEditPromoAdOpen, setIsEditPromoAdOpen] = useState(false);
  
  // Form states
  const [heroSliderForm, setHeroSliderForm] = useState({
    id: '',
    title: '',
    description: '',
    buttonText: '',
    image: '',
    active: true
  });
  
  const [promoAdForm, setPromoAdForm] = useState({
    id: '',
    title: '',
    description: '',
    buttonText: '',
    image: '',
    active: true
  });

  // Fetch hero sliders
  const { 
    data: heroSliders = [], 
    isLoading: isLoadingHeroSliders 
  } = useQuery<HeroSlider[]>({
    queryKey: ['/api/hero-sliders'],
  });

  // Fetch promo ads
  const { 
    data: promoAds = [], 
    isLoading: isLoadingPromoAds 
  } = useQuery<PromoAd[]>({
    queryKey: ['/api/promo-ads'],
  });

  // Filter hero sliders based on search term
  const filteredHeroSliders = heroSliders.filter(slider => 
    searchTerm === '' || 
    slider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slider.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter promo ads based on search term
  const filteredPromoAds = promoAds.filter(ad => 
    searchTerm === '' || 
    ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Add hero slider mutation
  const addHeroSliderMutation = useMutation({
    mutationFn: async (data: Omit<HeroSlider, 'id' | 'createdBy'>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      const response = await apiRequest('POST', '/api/hero-sliders', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-sliders'] });
      setIsAddHeroSliderOpen(false);
      resetHeroSliderForm();
      toast({
        title: 'Success',
        description: 'Hero slider added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add hero slider',
        variant: 'destructive',
      });
    },
  });

  // Update hero slider mutation
  const updateHeroSliderMutation = useMutation({
    mutationFn: async (data: Partial<HeroSlider> & { id: string }) => {
      const { id, ...updateData } = data;
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      const response = await apiRequest('PUT', `/api/hero-sliders/${id}`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-sliders'] });
      setIsEditHeroSliderOpen(false);
      resetHeroSliderForm();
      toast({
        title: 'Success',
        description: 'Hero slider updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update hero slider',
        variant: 'destructive',
      });
    },
  });

  // Delete hero slider mutation
  const deleteHeroSliderMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/hero-sliders/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hero-sliders'] });
      toast({
        title: 'Success',
        description: 'Hero slider deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete hero slider',
        variant: 'destructive',
      });
    },
  });

  // Add promo ad mutation
  const addPromoAdMutation = useMutation({
    mutationFn: async (data: Omit<PromoAd, 'id' | 'createdBy'>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      });
      const response = await apiRequest('POST', '/api/promo-ads', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promo-ads'] });
      setIsAddPromoAdOpen(false);
      resetPromoAdForm();
      toast({
        title: 'Success',
        description: 'Promo ad added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add promo ad',
        variant: 'destructive',
      });
    },
  });

  // Update promo ad mutation
  const updatePromoAdMutation = useMutation({
    mutationFn: async (data: Partial<PromoAd> & { id: string }) => {
      const { id, ...updateData } = data;
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, typeof value === 'boolean' ? String(value) : value);
        }
      });
      const response = await apiRequest('PUT', `/api/promo-ads/${id}`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promo-ads'] });
      setIsEditPromoAdOpen(false);
      resetPromoAdForm();
      toast({
        title: 'Success',
        description: 'Promo ad updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update promo ad',
        variant: 'destructive',
      });
    },
  });

  // Delete promo ad mutation
  const deletePromoAdMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/promo-ads/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/promo-ads'] });
      toast({
        title: 'Success',
        description: 'Promo ad deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete promo ad',
        variant: 'destructive',
      });
    },
  });

  // Handle form submissions
  const handleAddHeroSlider = (e: React.FormEvent) => {
    e.preventDefault();
    addHeroSliderMutation.mutate({
      title: heroSliderForm.title,
      description: heroSliderForm.description,
      buttonText: heroSliderForm.buttonText,
      image: heroSliderForm.image,
      active: heroSliderForm.active
    });
  };

  const handleEditHeroSlider = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroSliderMutation.mutate({
      id: heroSliderForm.id,
      title: heroSliderForm.title,
      description: heroSliderForm.description,
      buttonText: heroSliderForm.buttonText,
      image: heroSliderForm.image,
      active: heroSliderForm.active
    });
  };

  const handleAddPromoAd = (e: React.FormEvent) => {
    e.preventDefault();
    addPromoAdMutation.mutate({
      title: promoAdForm.title,
      description: promoAdForm.description,
      buttonText: promoAdForm.buttonText,
      image: promoAdForm.image,
      active: promoAdForm.active
    });
  };

  const handleEditPromoAd = (e: React.FormEvent) => {
    e.preventDefault();
    updatePromoAdMutation.mutate({
      id: promoAdForm.id,
      title: promoAdForm.title,
      description: promoAdForm.description,
      buttonText: promoAdForm.buttonText,
      image: promoAdForm.image,
      active: promoAdForm.active
    });
  };

  const handleDeleteHeroSlider = (id: string) => {
    if (window.confirm('Are you sure you want to delete this hero slider?')) {
      deleteHeroSliderMutation.mutate(id);
    }
  };

  const handleDeletePromoAd = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promo ad?')) {
      deletePromoAdMutation.mutate(id);
    }
  };

  // Reset form states
  const resetHeroSliderForm = () => {
    setHeroSliderForm({
      id: '',
      title: '',
      description: '',
      buttonText: '',
      image: '',
      active: true
    });
  };

  const resetPromoAdForm = () => {
    setPromoAdForm({
      id: '',
      title: '',
      description: '',
      buttonText: '',
      image: '',
      active: true
    });
  };

  // Prepare hero slider for editing
  const prepareHeroSliderForEdit = (slider: HeroSlider) => {
    setHeroSliderForm({
      id: slider.id.toString(),
      title: slider.title,
      description: slider.description,
      buttonText: slider.buttonText,
      image: slider.image,
      active: slider.active
    });
    setIsEditHeroSliderOpen(true);
  };

  // Prepare promo ad for editing
  const preparePromoAdForEdit = (ad: PromoAd) => {
    setPromoAdForm({
      id: ad.id.toString(),
      title: ad.title,
      description: ad.description || '',
      buttonText: ad.buttonText || '',
      image: ad.image,
      active: ad.active
    });
    setIsEditPromoAdOpen(true);
  };

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center">You don't have permission to access this page.</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AdminHeader />
      
      <main className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
              <p className="text-muted-foreground">Manage hero sliders and promotional ads</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="hero-sliders" className="flex items-center">
                  <Layers className="mr-2 h-4 w-4" />
                  Hero Sliders
                </TabsTrigger>
                <TabsTrigger value="promo-ads" className="flex items-center">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Promotional Ads
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search content..." 
                    className="w-full pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {activeTab === 'hero-sliders' ? (
                  <Button onClick={() => setIsAddHeroSliderOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Hero Slider
                  </Button>
                ) : (
                  <Button onClick={() => setIsAddPromoAdOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Promo Ad
                  </Button>
                )}
              </div>
            </div>
            
            <TabsContent value="hero-sliders" className="mt-6">
              {isLoadingHeroSliders ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <Layers className="mx-auto h-10 w-10 text-muted-foreground animate-pulse" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading hero sliders...</p>
                  </div>
                </div>
              ) : filteredHeroSliders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Layers className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Hero Sliders Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first hero slider'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddHeroSliderOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Hero Slider
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredHeroSliders.map((slider) => (
                    <Card key={slider.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img 
                          src={slider.image} 
                          alt={slider.title} 
                          className="object-cover w-full h-full"
                        />
                        {!slider.active && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Inactive
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{slider.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{slider.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Button: {slider.buttonText}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => prepareHeroSliderForEdit(slider)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteHeroSlider(slider.id.toString())}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="promo-ads" className="mt-6">
              {isLoadingPromoAds ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <LayoutGrid className="mx-auto h-10 w-10 text-muted-foreground animate-pulse" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading promotional ads...</p>
                  </div>
                </div>
              ) : filteredPromoAds.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Promotional Ads Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first promotional ad'}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setIsAddPromoAdOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Promotional Ad
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPromoAds.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img 
                          src={ad.image} 
                          alt={ad.title} 
                          className="object-cover w-full h-full"
                        />
                        {!ad.active && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Inactive
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{ad.title}</CardTitle>
                        {ad.description && (
                          <CardDescription className="line-clamp-2">{ad.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {ad.buttonText ? `Button: ${ad.buttonText}` : 'No button text'}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => preparePromoAdForEdit(ad)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeletePromoAd(ad.id.toString())}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Add Hero Slider Dialog */}
      <Dialog open={isAddHeroSliderOpen} onOpenChange={setIsAddHeroSliderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Hero Slider</DialogTitle>
            <DialogDescription>
              Create a new hero slider for the homepage carousel.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddHeroSlider}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={heroSliderForm.title}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, title: e.target.value})}
                  placeholder="Enter slider title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroSliderForm.description}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, description: e.target.value})}
                  placeholder="Enter slider description"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={heroSliderForm.buttonText}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, buttonText: e.target.value})}
                  placeholder="Enter button text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={heroSliderForm.image}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, image: e.target.value})}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={heroSliderForm.active}
                  onCheckedChange={(checked) => setHeroSliderForm({...heroSliderForm, active: checked})}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                resetHeroSliderForm();
                setIsAddHeroSliderOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={addHeroSliderMutation.isPending}>
                {addHeroSliderMutation.isPending ? 'Adding...' : 'Add Slider'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Hero Slider Dialog */}
      <Dialog open={isEditHeroSliderOpen} onOpenChange={setIsEditHeroSliderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Hero Slider</DialogTitle>
            <DialogDescription>
              Update the hero slider details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditHeroSlider}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={heroSliderForm.title}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, title: e.target.value})}
                  placeholder="Enter slider title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={heroSliderForm.description}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, description: e.target.value})}
                  placeholder="Enter slider description"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-buttonText">Button Text</Label>
                <Input
                  id="edit-buttonText"
                  value={heroSliderForm.buttonText}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, buttonText: e.target.value})}
                  placeholder="Enter button text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input
                  id="edit-image"
                  value={heroSliderForm.image}
                  onChange={(e) => setHeroSliderForm({...heroSliderForm, image: e.target.value})}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={heroSliderForm.active}
                  onCheckedChange={(checked) => setHeroSliderForm({...heroSliderForm, active: checked})}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                resetHeroSliderForm();
                setIsEditHeroSliderOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateHeroSliderMutation.isPending}>
                {updateHeroSliderMutation.isPending ? 'Updating...' : 'Update Slider'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Promo Ad Dialog */}
      <Dialog open={isAddPromoAdOpen} onOpenChange={setIsAddPromoAdOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Promotional Ad</DialogTitle>
            <DialogDescription>
              Create a new promotional ad for the website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPromoAd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ad-title">Title</Label>
                <Input
                  id="ad-title"
                  value={promoAdForm.title}
                  onChange={(e) => setPromoAdForm({...promoAdForm, title: e.target.value})}
                  placeholder="Enter ad title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ad-description">Description (Optional)</Label>
                <Textarea
                  id="ad-description"
                  value={promoAdForm.description}
                  onChange={(e) => setPromoAdForm({...promoAdForm, description: e.target.value})}
                  placeholder="Enter ad description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ad-buttonText">Button Text (Optional)</Label>
                <Input
                  id="ad-buttonText"
                  value={promoAdForm.buttonText}
                  onChange={(e) => setPromoAdForm({...promoAdForm, buttonText: e.target.value})}
                  placeholder="Enter button text"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ad-image">Image URL</Label>
                <Input
                  id="ad-image"
                  value={promoAdForm.image}
                  onChange={(e) => setPromoAdForm({...promoAdForm, image: e.target.value})}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ad-active"
                  checked={promoAdForm.active}
                  onCheckedChange={(checked) => setPromoAdForm({...promoAdForm, active: checked})}
                />
                <Label htmlFor="ad-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                resetPromoAdForm();
                setIsAddPromoAdOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={addPromoAdMutation.isPending}>
                {addPromoAdMutation.isPending ? 'Adding...' : 'Add Ad'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Promo Ad Dialog */}
      <Dialog open={isEditPromoAdOpen} onOpenChange={setIsEditPromoAdOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Promotional Ad</DialogTitle>
            <DialogDescription>
              Update the promotional ad details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPromoAd}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-ad-title">Title</Label>
                <Input
                  id="edit-ad-title"
                  value={promoAdForm.title}
                  onChange={(e) => setPromoAdForm({...promoAdForm, title: e.target.value})}
                  placeholder="Enter ad title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-ad-description">Description (Optional)</Label>
                <Textarea
                  id="edit-ad-description"
                  value={promoAdForm.description}
                  onChange={(e) => setPromoAdForm({...promoAdForm, description: e.target.value})}
                  placeholder="Enter ad description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-ad-buttonText">Button Text (Optional)</Label>
                <Input
                  id="edit-ad-buttonText"
                  value={promoAdForm.buttonText}
                  onChange={(e) => setPromoAdForm({...promoAdForm, buttonText: e.target.value})}
                  placeholder="Enter button text"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-ad-image">Image URL</Label>
                <Input
                  id="edit-ad-image"
                  value={promoAdForm.image}
                  onChange={(e) => setPromoAdForm({...promoAdForm, image: e.target.value})}
                  placeholder="Enter image URL"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-ad-active"
                  checked={promoAdForm.active}
                  onCheckedChange={(checked) => setPromoAdForm({...promoAdForm, active: checked})}
                />
                <Label htmlFor="edit-ad-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                resetPromoAdForm();
                setIsEditPromoAdOpen(false);
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePromoAdMutation.isPending}>
                {updatePromoAdMutation.isPending ? 'Updating...' : 'Update Ad'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentPage;