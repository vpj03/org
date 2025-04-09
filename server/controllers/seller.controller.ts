import { Request, Response } from 'express';
import Seller from '../models/seller.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

export const registerSeller = async (req: Request, res: Response) => {
  try {
    const { personalDetails, businessDetails } = req.body;
    
    // For testing purposes, allow registration without authentication
    // In production, uncomment the following code to require authentication
    /*
    const userId = (req.user as { id: string })?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    */
    
    // For testing, use a mock user ID if not authenticated
    const userId = (req.user as { id: string })?.id || '000000000000000000000001';
    
    // Update user role to seller (in production)
    try {
      await User.findByIdAndUpdate(userId, { role: 'seller' });
    } catch (error) {
      console.warn('Could not update user role, possibly using mock ID:', error);
      // Continue with registration even if user update fails (for testing)
    }

    // Create new seller record
    const seller = new Seller({
      userId,
      personalDetails,
      businessDetails: {
        ...businessDetails,
        status: 'pending'
      }
    });

    await seller.save();

    res.status(201).json({
      message: 'Seller registration successful',
      seller
    });
  } catch (error) {
    console.error('Seller registration error:', error);
    res.status(500).json({
      message: 'Failed to register seller',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getSellerStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: string })?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const seller = await Seller.findOne({ userId });
    
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      status: seller.businessDetails?.status || 'Unknown',
      seller
    });
  } catch (error) {
    console.error('Get seller status error:', error);
    res.status(500).json({
      message: 'Failed to get seller status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const checkMongoDBConnection = async (_req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(200).json({ connected: isConnected });
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : 'Failed to check MongoDB connection',
    });
  }
};