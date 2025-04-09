import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Product Variant interface
interface IProductVariant {
  size: string; // Size/Weight/Volume (e.g., 500g, 1L)
  color: string; // Color/Type if applicable
  price: number; // Price per variant
  discountPrice: number | null; // Discount/Offer price
  stock: number; // Stock quantity
  unit: string; // Unit of measurement (Kg, Litre, Dozen, Pack, etc.)
}

// Nutritional Information interface
interface INutritionalInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  vitamins: string;
  minerals: string;
  additionalInfo: string;
}

// Shipping Details interface
interface IShippingDetails {
  weight: number; // Shipping weight
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingCharges: number | null; // null for free shipping
  deliveryTime: string; // e.g., "3-5 working days"
  returnPolicy: {
    allowed: boolean;
    conditions: string;
  };
}

// Legal & Certifications interface
interface ILegalCertifications {
  fssaiLicense: string; // FSSAI License Number for food products
  organicCertification: string; // Organic Certification (e.g., India Organic, USDA)
  batchNumber: string; // Batch Number/Lot Number
  manufactureDate: Date;
  expiryDate: Date; // Expiry Date/Best Before
}

// SEO Details interface
interface ISeoDetails {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

// Product interface
export interface IProduct extends Document {
  // Basic Product Information
  name: string;
  category: Schema.Types.ObjectId;
  brand: Schema.Types.ObjectId | null;
  sku: string; // Stock Keeping Unit - unique product code
  productType: string; // Simple, Variable
  tags: string[];
  isOrganic: boolean;
  
  // Product Variants
  variants: IProductVariant[];
  
  // Media
  mainImage: string;
  additionalImages: string[];
  video: string | null;
  
  // Description
  shortDescription: string;
  detailedDescription: string;
  nutritionalInfo: INutritionalInfo | null;
  ingredients: string;
  shelfLife: string;
  
  // Shipping & Delivery
  shippingDetails: IShippingDetails;
  
  // Legal & Certifications
  legalCertifications: ILegalCertifications | null;
  
  // SEO Details
  seoDetails: ISeoDetails;
  
  // Other Details
  sellerId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Product Variant Schema
const productVariantSchema = new Schema({
  size: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    default: '' 
  },
  price: { 
    type: Number, 
    required: true 
  },
  discountPrice: { 
    type: Number, 
    default: null 
  },
  stock: { 
    type: Number, 
    required: true,
    default: 0 
  },
  unit: { 
    type: String, 
    required: true 
  }
});

// Nutritional Information Schema
const nutritionalInfoSchema = new Schema({
  calories: { type: Number },
  protein: { type: Number },
  carbohydrates: { type: Number },
  fat: { type: Number },
  fiber: { type: Number },
  vitamins: { type: String },
  minerals: { type: String },
  additionalInfo: { type: String }
});

// Shipping Details Schema
const shippingDetailsSchema = new Schema({
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  shippingCharges: { type: Number, default: null },
  deliveryTime: { type: String },
  returnPolicy: {
    allowed: { type: Boolean, default: false },
    conditions: { type: String }
  }
});

// Legal & Certifications Schema
const legalCertificationsSchema = new Schema({
  fssaiLicense: { type: String },
  organicCertification: { type: String },
  batchNumber: { type: String },
  manufactureDate: { type: Date },
  expiryDate: { type: Date }
});

// SEO Details Schema
const seoDetailsSchema = new Schema({
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: [{ type: String }]
});

// Product schema
const productSchema = new Schema<IProduct>({
  // Basic Product Information
  name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    required: true 
  },
  brand: { 
    type: Schema.Types.ObjectId, 
    ref: 'Brand',
    default: null 
  },
  sku: { 
    type: String, 
    required: true,
    unique: true 
  },
  productType: { 
    type: String, 
    enum: ['Simple', 'Variable'],
    default: 'Simple' 
  },
  tags: [{ 
    type: String 
  }],
  isOrganic: { 
    type: Boolean, 
    default: true 
  },
  
  // Product Variants
  variants: [productVariantSchema],
  
  // Media
  mainImage: { 
    type: String, 
    required: true 
  },
  additionalImages: [{ 
    type: String 
  }],
  video: { 
    type: String, 
    default: null 
  },
  
  // Description
  shortDescription: { 
    type: String, 
    required: true 
  },
  detailedDescription: { 
    type: String, 
    required: true 
  },
  nutritionalInfo: { 
    type: nutritionalInfoSchema, 
    default: null 
  },
  ingredients: { 
    type: String 
  },
  shelfLife: { 
    type: String 
  },
  
  // Shipping & Delivery
  shippingDetails: { 
    type: shippingDetailsSchema, 
    default: () => ({}) 
  },
  
  // Legal & Certifications
  legalCertifications: { 
    type: legalCertificationsSchema, 
    default: null 
  },
  
  // SEO Details
  seoDetails: { 
    type: seoDetailsSchema, 
    default: () => ({}) 
  },
  
  // Other Details
  sellerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Create and export the Product model
export default mongoose.model<IProduct>('Product', productSchema);
export const Product = mongoose.model<IProduct>('Product', productSchema);