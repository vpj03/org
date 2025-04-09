import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Cart interface
export interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  createdAt: Date;
}

// Cart schema
const cartSchema = new Schema<ICart>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Add a virtual to populate cart items
cartSchema.virtual("items", {
  ref: "CartItem",
  localField: "_id",
  foreignField: "cartId",
});
cartSchema.set("toObject", { virtuals: true });
cartSchema.set("toJSON", { virtuals: true });

// Create and export the Cart model
export const Cart = mongoose.model<ICart>('Cart', cartSchema);