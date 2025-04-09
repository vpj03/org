import express from 'express';
import { checkMongoDBConnection, registerSeller } from '../controllers/seller.controller';
import { checkBackendConnection } from '../controllers/backend.controller';

const router = express.Router();

// ...existing routes...
router.get('/api/mongodb-status', checkMongoDBConnection);
router.post('/api/seller-registration', registerSeller);

// New endpoint for backend connection
router.get('/api/connection', checkBackendConnection);

export default router;
