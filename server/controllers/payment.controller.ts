import { Request, Response } from 'express';
import { Payment, Order } from '../models';
import { paymentService } from '../services/payment.service';

// Controller for handling payment operations
export const paymentController = {
  // Process a new payment
  processPayment: async (req: Request, res: Response) => {
    try {
      const { orderId, method, amount } = req.body;
      
      if (!orderId || !method || !amount) {
        return res.status(400).json({ error: 'Missing required payment information' });
      }
      
      // Check if order exists
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Create a new payment record
      const payment = new Payment({
        orderId,
        method,
        amount,
        currency: 'INR', // Default currency
        status: 'pending'
      });
      
      // Process payment based on method
      try {
        switch (method) {
          case 'credit_card':
            // Extract card details from request if provided
            const cardDetails = req.body.cardDetails || {};
            
            // Validate card details if provided
            if (cardDetails.number) {
              // Basic validation - in production you'd use a proper validation library
              if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
                return res.status(400).json({ error: 'Incomplete card details provided' });
              }
            }
            
            // Process credit card payment through payment service
            const ccResult = await paymentService.processCreditCardPayment(amount, cardDetails);
            
            if (ccResult.success) {
              payment.status = ccResult.status;
              payment.transactionId = ccResult.transactionId;
              payment.paymentDetails = { 
                ...payment.paymentDetails,
                lastFour: cardDetails.number ? cardDetails.number.slice(-4) : 'xxxx',
                cardType: cardDetails.type || 'Unknown'
              };
            } else {
              payment.status = 'failed';
            }
            break;
            
          case 'paypal':
            // Extract PayPal details from request if provided
            const paypalDetails = req.body.paypalDetails || {};
            
            // Process PayPal payment through payment service
            const ppResult = await paymentService.processPayPalPayment(amount, paypalDetails);
            
            if (ppResult.success) {
              payment.status = ppResult.status;
              payment.transactionId = ppResult.transactionId;
            } else {
              payment.status = 'failed';
            }
            break;
            
          case 'bank_transfer':
            // Process bank transfer through payment service
            const btResult = await paymentService.processBankTransfer(amount, {
              orderId,
              customerName: req.body.customerName || 'Customer'
            });
            
            if (btResult.success) {
              payment.status = btResult.status;
              payment.transactionId = btResult.transactionId;
              payment.paymentDetails = { 
                instructions: 'Please transfer to account #1234567890, IFSC Code: ABCD0001234',
                accountName: 'Organic Marketplace',
                accountNumber: '1234567890',
                ifscCode: 'ABCD0001234',
                bankName: 'National Bank',
                reference: `Order-${orderId}`,
                referenceNumber: btResult.referenceNumber,
                note: 'Please include your Order ID as reference when making the transfer',
                verificationRequired: true
              };
            } else {
              payment.status = 'failed';
              payment.paymentDetails = { error: btResult.error };
            }
            break;
            
          case 'cash_on_delivery':
            // Process cash on delivery through payment service
            const codFee = 0; // Could be calculated based on order value or location
            const codResult = await paymentService.processCashOnDelivery(amount, { codFee });
            
            if (codResult.success) {
              payment.status = codResult.status;
              payment.transactionId = codResult.transactionId;
              payment.paymentDetails = { 
                codFee: codResult.codFee,
                payableAmount: codResult.totalAmount,
                instructions: 'Payment will be collected at the time of delivery',
                note: 'Please keep exact change ready for a smooth delivery experience',
                deliveryVerification: 'Signature required on delivery'
              };
            } else {
              payment.status = 'failed';
              payment.paymentDetails = { error: codResult.error };
            }
            break;
            
          default:
            return res.status(400).json({ error: 'Invalid payment method' });
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        payment.status = 'failed';
        payment.paymentDetails = { error: error.message };
      }
      
      // Save the payment
      await payment.save();
      
      // Update order status based on payment status
      if (payment.status === 'completed') {
        order.status = 'processing';
        await order.save();
      } else if (payment.status === 'failed') {
        order.status = 'pending';
        await order.save();
      } else if (payment.status === 'processing') {
        // For methods like COD or bank transfer
        order.status = 'processing';
        await order.save();
      }
      
      return res.status(201).json({
        success: true,
        payment: {
          id: payment._id,
          orderId: payment.orderId,
          amount: payment.amount,
          method: payment.method,
          status: payment.status,
          createdAt: payment.createdAt
        }
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      return res.status(500).json({ error: 'Failed to process payment' });
    }
  },
  
  // Get payment by ID
  getPayment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      return res.status(200).json(payment);
    } catch (error) {
      console.error('Error fetching payment:', error);
      return res.status(500).json({ error: 'Failed to fetch payment details' });
    }
  },
  
  // Get payments for an order
  getPaymentsByOrder: async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const payments = await Payment.find({ orderId });
      
      return res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching order payments:', error);
      return res.status(500).json({ error: 'Failed to fetch order payments' });
    }
  },
  
  // Update payment status (for admin/webhook callbacks)
  updatePaymentStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;
      
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      // Update payment status
      payment.status = status;
      if (transactionId) {
        payment.transactionId = transactionId;
      }
      
      await payment.save();
      
      // If payment is completed, update the order status
      if (status === 'completed') {
        const order = await Order.findById(payment.orderId);
        if (order) {
          order.status = 'processing';
          await order.save();
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          id: payment._id,
          status: payment.status,
          transactionId: payment.transactionId
        }
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }
  }
};