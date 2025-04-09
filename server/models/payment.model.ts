import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Payment status type
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

// Payment method type
export type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

// Payment interface
export interface IPayment extends Document {
  orderId: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Payment schema
const paymentSchema = new Schema<IPayment>({
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  method: { 
    type: String, 
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending' 
  },
  transactionId: { 
    type: String,
    sparse: true
  },
  paymentDetails: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Create and export the Payment model
export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);