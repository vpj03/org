import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// CartItem interface
export interface ICartItem extends Document {
  cartId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  quantity: number;
}

// CartItem schema
const cartItemSchema = new Schema<ICartItem>({
  cartId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Cart',
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
    min: 1,
    default: 1 
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate cart items
cartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });

// Create and export the CartItem model
export const CartItem = mongoose.model<ICartItem>('CartItem', cartItemSchema);

// No changes needed for the CartItem model.