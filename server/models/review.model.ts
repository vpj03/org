import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Review interface
export interface IReview extends Document {
  userId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  rating: number;
  comment: string | null;
  createdAt: Date;
}

// Review schema
const reviewSchema = new Schema<IReview>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  productId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  comment: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to prevent multiple reviews from the same user for the same product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Create and export the Review model
export const Review = mongoose.model<IReview>('Review', reviewSchema);