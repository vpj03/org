import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Remove axios import
import { useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '@/lib/queryClient'; // Import apiRequest

interface ProductFormProps {
  isEdit?: boolean;
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  unit: string;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  vitamins: string;
  minerals: string;
  additionalInfo: string;
}

interface ShippingDetails {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingCharges: number | null;
  deliveryTime: string;
  returnPolicy: {
    allowed: boolean;
    conditions: string;
  };
}

interface LegalCertifications {
  fssaiLicense: string;
  organicCertification: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
}

interface SeoDetails {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

interface ProductFormData {
  // Basic Product Information
  name: string;
  category: string;
  brand: string;
  sku: string;
  productType: 'Simple' | 'Variable';
  tags: string[];
  isOrganic: boolean;
  
  // Product Variants
  variants: ProductVariant[];
  
  // Media
  mainImage: File | null;
  additionalImages: File[];
  video: File | null;
  
  // Description
  shortDescription: string;
  detailedDescription: string;
  nutritionalInfo: NutritionalInfo | null;
  ingredients: string;
  shelfLife: string;
  
  // Shipping & Delivery
  shippingDetails: ShippingDetails;
  
  // Legal & Certifications
  legalCertifications: LegalCertifications | null;
  
  // SEO Details
  seoDetails: SeoDetails;
}

const initialVariant: ProductVariant = {
  size: '',
  color: '',
  price: 0,
  discountPrice: null,
  stock: 0,
  unit: 'Piece'
};

const initialNutritionalInfo: NutritionalInfo = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  vitamins: '',
  minerals: '',
  additionalInfo: ''
};

const initialShippingDetails: ShippingDetails = {
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  shippingCharges: null,
  deliveryTime: '3-5 working days',
  returnPolicy: {
    allowed: false,
    conditions: ''
  }
};

const initialLegalCertifications: LegalCertifications = {
  fssaiLicense: '',
  organicCertification: '',
  batchNumber: '',
  manufactureDate: '',
  expiryDate: ''
};

const initialSeoDetails: SeoDetails = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: []
};

const initialFormData: ProductFormData = {
  // Basic Product Information
  name: '',
  category: '',
  brand: '',
  sku: '',
  productType: 'Simple',
  tags: [],
  isOrganic: true,
  
  // Product Variants
  variants: [initialVariant],
  
  // Media
  mainImage: null,
  additionalImages: [],
  video: null,
  
  // Description
  shortDescription: '',
  detailedDescription: '',
  nutritionalInfo: initialNutritionalInfo,
  ingredients: '',
  shelfLife: '',
  
  // Shipping & Delivery
  shippingDetails: initialShippingDetails,
  
  // Legal & Certifications
  legalCertifications: initialLegalCertifications,
  
  // SEO Details
  seoDetails: initialSeoDetails
};

const ProductForm: React.FC<ProductFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [tagInput, setTagInput] = useState<string>('');
  const [keywordInput, setKeywordInput] = useState<string>('');
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use apiRequest for fetching categories and brands
        const [categoriesRes, brandsRes] = await Promise.all([
          apiRequest('GET', '/api/categories'),
          apiRequest('GET', '/api/brands')
        ]);
        setCategories(await categoriesRes.json());
        setBrands(await brandsRes.json());
      } catch (err) {
        setError('Failed to load categories and brands');
        console.error(err);
      }
    };

    fetchData();

    // If editing, fetch product data
    if (isEdit && id) {
      fetchProductData(id);
    }
  }, [isEdit, id]);

  const fetchProductData = async (productId: string) => {
    try {
      setLoading(true);
      // Use apiRequest for fetching product data
      const res = await apiRequest('GET', `/api/products/${productId}`);
      const product = await res.json();

      // Transform API data to form data format
      setFormData({
        name: product.name,
        category: product.category._id,
        brand: product.brand?._id || '',
        sku: product.sku,
        productType: product.productType,
        tags: product.tags,
        isOrganic: product.isOrganic,
        variants: product.variants,
        mainImage: null, // Can't set file objects from API
        additionalImages: [],
        video: null,
        shortDescription: product.shortDescription,
        detailedDescription: product.detailedDescription,
        nutritionalInfo: product.nutritionalInfo,
        ingredients: product.ingredients,
        shelfLife: product.shelfLife,
        shippingDetails: product.shippingDetails,
        legalCertifications: product.legalCertifications,
        seoDetails: product.seoDetails
      });
    } catch (err) {
      setError('Failed to load product data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ProductFormData],
        [field]: value
      }
    }));
  };

  const handleNestedObjectInputChange = (section: string, parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof ProductFormData],
        [parentField]: {
          ...(prev[section as keyof ProductFormData] as any)[parentField],
          [field]: value
        }
      }
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, initialVariant]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length > 1) {
      const updatedVariants = formData.variants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        variants: updatedVariants
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (!files) return;

    if (name === 'mainImage') {
      setFormData(prev => ({
        ...prev,
        mainImage: files[0]
      }));
    } else if (name === 'video') {
      setFormData(prev => ({
        ...prev,
        video: files[0]
      }));
    } else if (name === 'additionalImages') {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        additionalImages: fileArray
      }));
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleKeywordAdd = () => {
    if (keywordInput.trim() && !formData.seoDetails.metaKeywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoDetails: {
          ...prev.seoDetails,
          metaKeywords: [...prev.seoDetails.metaKeywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoDetails: {
        ...prev.seoDetails,
        metaKeywords: prev.seoDetails.metaKeywords.filter(k => k !== keyword)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData object for file uploads
      const productFormData = new FormData();
      
      // Add basic fields
      productFormData.append('name', formData.name);
      productFormData.append('category', formData.category);
      if (formData.brand) productFormData.append('brand', formData.brand);
      productFormData.append('sku', formData.sku);
      productFormData.append('productType', formData.productType);
      productFormData.append('tags', JSON.stringify(formData.tags));
      productFormData.append('isOrganic', String(formData.isOrganic));
      
      // Add variants
      productFormData.append('variants', JSON.stringify(formData.variants));
      
      // Add descriptions
      productFormData.append('shortDescription', formData.shortDescription);
      productFormData.append('detailedDescription', formData.detailedDescription);
      productFormData.append('ingredients', formData.ingredients);
      productFormData.append('shelfLife', formData.shelfLife);
      
      // Add complex objects
      productFormData.append('nutritionalInfo', JSON.stringify(formData.nutritionalInfo));
      productFormData.append('shippingDetails', JSON.stringify(formData.shippingDetails));
      productFormData.append('legalCertifications', JSON.stringify(formData.legalCertifications));
      productFormData.append('seoDetails', JSON.stringify(formData.seoDetails));
      
      // Add files
      if (formData.mainImage) {
        productFormData.append('mainImage', formData.mainImage);
      }
      
      if (formData.video) {
        productFormData.append('video', formData.video);
      }
      
      formData.additionalImages.forEach((image, index) => {
        productFormData.append('additionalImages', image);
      });

      // Send request
      if (isEdit && id) {
        // Use apiRequest for updating product
        await apiRequest('PUT', `/api/products/${id}`, productFormData);
      } else {
        // Use apiRequest for creating product
        await apiRequest('POST', '/api/products', productFormData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 2000);
    } catch (err) {
      setError('Failed to save product. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product {isEdit ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'basic' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'variants' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('variants')}
        >
          Variants
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('media')}
        >
          Media
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'shipping' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('shipping')}
        >
          Shipping
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'legal' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('legal')}
        >
          Legal
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'seo' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('seo')}
        >
          SEO
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Product Information */}
        {activeTab === 'basic' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Product Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="e.g., Organic Almonds 500g"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit) *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="Unique product code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Brand (Optional)</option>
                  {brands.map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="Simple">Simple</option>
                  <option value="Variable">Variable (for size/weight variants)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Is Organic?</label>
                <div className="mt-2">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <span>Yes, this product is organic</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags / Keywords</label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full p-2 border rounded-l"
                  placeholder="e.g., organic, gluten-free, natural"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap mt-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 px-2 py-1 rounded m-1 text-sm flex items-center">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Product Variants */}
        {activeTab === 'variants' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Variants</h2>
            
            {formData.variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Variant {index + 1}</h3>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Size/Weight/Volume *</label>
                    <input
                      type="text"
                      value={variant.size}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="e.g., 500g, 1L"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color/Type</label>
                    <input
                      type="text"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Red, Green (if applicable)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measurement *</label>
                    <input
                      type="text"
                      value={variant.unit}
                      onChange={(e) => handleVariantChange(index, 'unit', e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                      placeholder="e.g., Kg, Litre, Dozen, Pack"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value))}
                      className="w-full p-2 border rounded"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
                    <input
                      type="number"
                      value={variant.discountPrice || ''}
                      onChange={(e) => handleVariantChange(index, 'discountPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      className="w-full p-2 border rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value))}
                      className="w-full p-2 border rounded"
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addVariant}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Another Variant
            </button>
          </div>
        )}
        
        {/* Media */}
        {activeTab === 'media' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Media</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Product Image *</label>
              <input
                type="file"
                name="mainImage"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                required={!isEdit}
              />
              {isEdit && <p className="text-sm text-gray-500 mt-1">Leave empty to keep the current image</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images (max 7)</label>
              <input
                type="file"
                name="additionalImages"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept="image/*"
                multiple
                max="7"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Video (optional)</label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                className="w-full p-2 border rounded"
                accept="video/*"
              />
            </div>
          </div>
        )}
        
        {/* Description */}
        {activeTab === 'description' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Description</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                rows={3}
                placeholder="Brief description for product listings"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
              <textarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
                rows={6}
                placeholder="Comprehensive description including benefits, usage, certifications"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients / Composition</label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="List of ingredients or composition"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Life / Expiry</label>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., 12 months from manufacture date"
              />
            </div>
            
            <div className="border p-4 rounded mb-4">
              <h3 className="font-medium mb-2">Nutritional Information (for food products)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo?.calories || 0}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'calories', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo?.protein || 0}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'protein', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carbohydrates (g)</label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo?.carbohydrates || 0}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'carbohydrates', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo?.fat || 0}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'fat', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fiber (g)</label>
                  <input
                    type="number"
                    value={formData.nutritionalInfo?.fiber || 0}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'fiber', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                    min="0"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vitamins</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo?.vitamins || ''}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'vitamins', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Vitamin A, B, C"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minerals</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo?.minerals || ''}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'minerals', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Iron, Calcium, Zinc"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
                  <input
                    type="text"
                    value={formData.nutritionalInfo?.additionalInfo || ''}
                    onChange={(e) => handleNestedInputChange('nutritionalInfo', 'additionalInfo', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Any other nutritional information"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Shipping & Delivery */}
        {activeTab === 'shipping' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping & Delivery</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Weight (kg)</label>
                <input
                  type="number"
                  value={formData.shippingDetails.weight || 0}
                  onChange={(e) => handleNestedInputChange('shippingDetails', 'weight', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Charges</label>
                <input
                  type="number"
                  value={formData.shippingDetails.shippingCharges || ''}
                  onChange={(e) => handleNestedInputChange('shippingDetails', 'shippingCharges', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for free shipping"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L × W × H in cm)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formData.shippingDetails.dimensions.length || 0}
                  onChange={(e) => handleNestedObjectInputChange('shippingDetails', 'dimensions', 'length', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.1"
                  placeholder="Length"
                />
                <input
                  type="number"
                  value={formData.shippingDetails.dimensions.width || 0}
                  onChange={(e) => handleNestedObjectInputChange('shippingDetails', 'dimensions', 'width', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.1"
                  placeholder="Width"
                />
                <input
                  type="number"
                  value={formData.shippingDetails.dimensions.height || 0}
                  onChange={(e) => handleNestedObjectInputChange('shippingDetails', 'dimensions', 'height', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="0"
                  step="0.1"
                  placeholder="Height"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
              <input
                type="text"
                value={formData.shippingDetails.deliveryTime || ''}
                onChange={(e) => handleNestedInputChange('shippingDetails', 'deliveryTime', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="e.g., 3-5 working days"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
              <div className="mb-2">
                <input
                  type="checkbox"
                  checked={formData.shippingDetails.returnPolicy.allowed}
                  onChange={(e) => handleNestedObjectInputChange('shippingDetails', 'returnPolicy', 'allowed', e.target.checked)}
                  className="mr-2"
                />
                <span>Returns Allowed</span>
              </div>
              <textarea
                value={formData.shippingDetails.returnPolicy.conditions || ''}
                onChange={(e) => handleNestedObjectInputChange('shippingDetails', 'returnPolicy', 'conditions', e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Return conditions and policy details"
              />
            </div>
          </div>
        )}
        
        {/* Legal & Certifications */}
        {activeTab === 'legal' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Legal & Certifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License Number</label>
                <input
                  type="text"
                  value={formData.legalCertifications?.fssaiLicense || ''}
                  onChange={(e) => handleNestedInputChange('legalCertifications', 'fssaiLicense', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="For food products"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organic Certification</label>
                <input
                  type="text"
                  value={formData.legalCertifications?.organicCertification || ''}
                  onChange={(e) => handleNestedInputChange('legalCertifications', 'organicCertification', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., India Organic, USDA"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number / Lot Number</label>
                <input
                  type="text"
                  value={formData.legalCertifications?.batchNumber || ''}
                  onChange={(e) => handleNestedInputChange('legalCertifications', 'batchNumber', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date</label>
                <input
                  type="date"
                  value={formData.legalCertifications?.manufactureDate || ''}
                  onChange={(e) => handleNestedInputChange('legalCertifications', 'manufactureDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date / Best Before</label>
                <input
                  type="date"
                  value={formData.legalCertifications?.expiryDate || ''}
                  onChange={(e) => handleNestedInputChange('legalCertifications', 'expiryDate', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* SEO Details */}
        {activeTab === 'seo' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">SEO Details</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                value={formData.seoDetails.metaTitle || ''}
                onChange={(e) => handleNestedInputChange('seoDetails', 'metaTitle', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="SEO optimized title (max 60 characters)"
                maxLength={60}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={formData.seoDetails.metaDescription || ''}
                onChange={(e) => handleNestedInputChange('seoDetails', 'metaDescription', e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="SEO optimized description (max 160 characters)"
                maxLength={160}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
              <div className="flex">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full p-2 border rounded-l"
                  placeholder="Add SEO keywords"
                />
                <button
                  type="button"
                  onClick={handleKeywordAdd}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap mt-2">
                {formData.seoDetails.metaKeywords.map(keyword => (
                  <span key={keyword} className="bg-gray-200 px-2 py-1 rounded m-1 text-sm flex items-center">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleKeywordRemove(keyword)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard/products')}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;