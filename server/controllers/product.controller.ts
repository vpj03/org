import { Request, Response } from 'express';
import Product from '../models/product.model';
import { storage } from '../storage';

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {  try {
    const products = await Product.find().populate('category').populate('brand');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get products by seller ID
export const getProductsBySeller = async (req: Request, res: Response) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await Product.find({ sellerId }).populate('category').populate('brand');
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({
      message: 'Failed to fetch seller products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate('category').populate('brand');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const userId = (req.user as { id: string })?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Set the seller ID to the current user's ID
    productData.sellerId = productData.sellerId || userId;
    
    // Ensure category and brand IDs are valid ObjectIds if provided
    if (productData.category && typeof productData.category === 'string') {
      try {
        if (!mongoose.Types.ObjectId.isValid(productData.category)) {
          productData.category = new mongoose.Types.ObjectId(productData.category);
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid category ID format' });
      }
    }
    
    if (productData.brand && typeof productData.brand === 'string') {
      try {
        if (!mongoose.Types.ObjectId.isValid(productData.brand)) {
          productData.brand = new mongoose.Types.ObjectId(productData.brand);
        }
      } catch (error) {
        return res.status(400).json({ message: 'Invalid brand ID format' });
      }
    }
    
    // Handle file uploads for images if they exist in the request
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle main product image
      if (files.mainImage && files.mainImage[0]) {
        productData.mainImage = files.mainImage[0].path;
      }
      
      // Handle additional images
      if (files.additionalImages) {
        productData.additionalImages = files.additionalImages.map(file => file.path);
      }
      
      // Handle product video if exists
      if (files.video && files.video[0]) {
        productData.video = files.video[0].path;
      }
    }
    
    // Ensure variants have all required fields
    if (productData.variants && Array.isArray(productData.variants)) {
      productData.variants = productData.variants.map(variant => ({
        size: variant.size,
        color: variant.color || '',
        price: parseFloat(variant.price),
        discountPrice: variant.discountPrice ? parseFloat(variant.discountPrice) : null,
        stock: parseInt(variant.stock, 10),
        unit: variant.unit
      }));
    } else {
      // If no variants provided, create a default one from the main product data
      productData.variants = [{
        size: productData.size || 'Default',
        color: productData.color || '',
        price: parseFloat(productData.price),
        discountPrice: productData.discountPrice ? parseFloat(productData.discountPrice) : null,
        stock: parseInt(productData.stock, 10),
        unit: productData.unit || 'Piece'
      }];
    }
    
    // Convert string dates to Date objects if provided
    if (productData.legalCertifications) {
      if (productData.legalCertifications.manufactureDate) {
        productData.legalCertifications.manufactureDate = new Date(productData.legalCertifications.manufactureDate);
      }
      if (productData.legalCertifications.expiryDate) {
        productData.legalCertifications.expiryDate = new Date(productData.legalCertifications.expiryDate);
      }
    }
    
    // Create and save the product
    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    const userId = (req.user as { id: string })?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find the product first to check ownership
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product or an admin
    const userRole = (req.user as { role: string })?.role;
    if (product.sellerId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    // Handle file uploads for images if they exist in the request
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle main product image
      if (files.mainImage && files.mainImage[0]) {
        updateData.mainImage = files.mainImage[0].path;
      }
      
      // Handle additional images
      if (files.additionalImages) {
        updateData.additionalImages = files.additionalImages.map(file => file.path);
      }
      
      // Handle product video if exists
      if (files.video && files.video[0]) {
        updateData.video = files.video[0].path;
      }
    }
    
    // Ensure variants have all required fields
    if (updateData.variants && Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants.map(variant => ({
        size: variant.size,
        color: variant.color || '',
        price: parseFloat(variant.price),
        discountPrice: variant.discountPrice ? parseFloat(variant.discountPrice) : null,
        stock: parseInt(variant.stock, 10),
        unit: variant.unit
      }));
    }
    
    // Convert string dates to Date objects if provided
    if (updateData.legalCertifications) {
      if (updateData.legalCertifications.manufactureDate) {
        updateData.legalCertifications.manufactureDate = new Date(updateData.legalCertifications.manufactureDate);
      }
      if (updateData.legalCertifications.expiryDate) {
        updateData.legalCertifications.expiryDate = new Date(updateData.legalCertifications.expiryDate);
      }
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).populate('category').populate('brand');
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    const userId = (req.user as { id: string })?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Find the product first to check ownership
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the owner of the product or an admin
    const userRole = (req.user as { role: string })?.role;
    if (product.sellerId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    await Product.findByIdAndDelete(productId);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};