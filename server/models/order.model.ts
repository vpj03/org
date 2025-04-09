import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Order status type
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order interface
export interface IOrder extends Document {
  buyerId: Schema.Types.ObjectId;
  address: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
}

// Order schema
const orderSchema = new Schema<IOrder>({
  buyerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create and export the Order model
export const Order = mongoose.model<IOrder>('Order', orderSchema);