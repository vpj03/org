import { Request, Response } from 'express';
import { storage } from '../storage';
import mongoose from 'mongoose';

// Controller for handling category operations
export const categoryController = {
  // Get all categories
  getAllCategories: async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },
  
  // Get category by ID
  getCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const category = await storage.getCategory(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      return res.status(200).json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      return res.status(500).json({ error: 'Failed to fetch category details' });
    }
  },
  
  // Create a new category
  createCategory: async (req: Request, res: Response) => {
    try {
      // Extract fields from req.body
      const { name, image, description } = req.body;
      
      // Check user authentication
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          details: 'User must be authenticated to create a category'
        });
      }

      // Get user ID from authenticated user
      const userId = (req.user as any).id;
      
      // Ensure userId is a valid ObjectId
      try {
        // If it's already a valid ObjectId, use it directly
        // If it's a string, convert it to ObjectId
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
          ? userId 
          : new mongoose.Types.ObjectId(userId);
        
        // Create the category with proper ObjectId
        const category = await storage.createCategory({
          name,
          image,
          description,
          createdBy: userObjectId // Use the validated ObjectId
        });
        
        return res.status(201).json(category);
      } catch (error) {
        console.error('Error processing user ID:', error);
        return res.status(400).json({
          error: 'Invalid user ID format',
          details: 'The user ID is not in a valid format'
        });
      }
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Handle specific MongoDB errors
      if (error instanceof Error) {
        if ((error as any).code === 11000) {
          return res.status(409).json({
            error: 'Category already exists',
            details: 'A category with this name already exists'
          });
        }
        if ((error as any).name === 'ValidationError') {
          return res.status(400).json({
            error: 'Validation error',
            details: error.message
          });
        }
      }
      
      return res.status(500).json({
        error: 'Internal server error',
        details: 'Failed to create category due to an unexpected error'
      });
    }
  },
  
  // Update a category
  updateCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;
      
      // Check if category exists
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // If name is being updated, check if it conflicts with an existing category
      if (name && name !== category.name) {
        const existingCategory = await storage.getCategoryByName(name);
        if (existingCategory && existingCategory.id !== id) {
          return res.status(400).json({ error: 'Category with this name already exists' });
        }
      }
      
      // Update the category
      const updatedCategory = await storage.updateCategory(id, {
        name,
        image
      });
      
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Failed to update category' });
    }
  },
  
  // Delete a category
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if category exists
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Delete the category
      const deleted = await storage.deleteCategory(id);
      
      if (deleted) {
        return res.status(204).send();
      } else {
        return res.status(500).json({ error: 'Failed to delete category' });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Failed to delete category' });
    }
  },
  
  // Get products by category
  getProductsByCategory: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if category exists
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Get products for the category
      const products = await storage.getProductsByCategory(id);
      
      return res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching category products:', error);
      return res.status(500).json({ error: 'Failed to fetch category products' });
    }
  }
};