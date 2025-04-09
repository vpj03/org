import express from 'express';
import { registerSeller, getSellerStatus, checkMongoDBConnection } from '../controllers/seller.controller';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Seller registration endpoint - removed authentication middleware for testing
router.post('/register', registerSeller);

// Get seller status endpoint
router.get('/status', isAuthenticated, getSellerStatus);

// Check MongoDB connection endpoint
router.get('/check-db', checkMongoDBConnection);

export default router;