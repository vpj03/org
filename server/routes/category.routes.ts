import express from 'express';
import { categoryController } from '../controllers/category.controller';
import { isAuthenticated, isAdmin, isAdminOrSeller } from '../middleware/auth';

const router = express.Router();

// Get all categories (public route)
router.get('/', categoryController.getAllCategories);

// Get category by ID (public route)
router.get('/:id', categoryController.getCategory);

// Get products by category (public route)
router.get('/:id/products', categoryController.getProductsByCategory);

// Create a new category (admin or seller only)
router.post('/', isAdminOrSeller, categoryController.createCategory);

// Update a category (admin or seller only)
router.put('/:id', isAdminOrSeller, categoryController.updateCategory);

// Delete a category (admin only)
router.delete('/:id', isAdmin, categoryController.deleteCategory);

export default router;