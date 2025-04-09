import express from 'express';
import * as productController from '../controllers/product.controller';
import { isAuthenticated, isAdmin, isSeller, isAdminOrSeller } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'products');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images and videos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and videos
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

const router = express.Router();

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get products by seller
router.get('/seller/:sellerId', productController.getProductsBySeller);

// Create a new product
router.post('/', 
  isAuthenticated, 
  isAdminOrSeller, 
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 7 },
    { name: 'video', maxCount: 1 }
  ]), 
  productController.createProduct
);

// Update a product
router.put('/:id', 
  isAuthenticated, 
  isAdminOrSeller, 
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 7 },
    { name: 'video', maxCount: 1 }
  ]), 
  productController.updateProduct
);

// Delete a product
router.delete('/:id', isAuthenticated, isAdminOrSeller, productController.deleteProduct);

export default router;