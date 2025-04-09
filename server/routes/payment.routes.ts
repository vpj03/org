import express from 'express';
import { paymentController } from '../controllers/payment.controller';

const router = express.Router();

// Process a new payment
router.post('/', paymentController.processPayment);

// Get payment by ID
router.get('/:id', paymentController.getPayment);

// Get payments for an order
router.get('/order/:orderId', paymentController.getPaymentsByOrder);

// Update payment status (for admin/webhook callbacks)
router.patch('/:id/status', paymentController.updatePaymentStatus);

export default router;