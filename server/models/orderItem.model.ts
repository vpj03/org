import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// OrderItem interface
export interface IOrderItem extends Document {
  orderId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

// OrderItem schema
const orderItemSchema = new Schema<IOrderItem>({
  orderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  price: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

// Create and export the OrderItem model
export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);