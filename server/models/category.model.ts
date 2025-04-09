import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Category interface
export interface ICategory extends Document {
  name: string;
  description: string;
  image: string;
  createdBy: Schema.Types.ObjectId;
}

// Category schema
const categorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

// Create and export the Category model
export const Category = mongoose.model<ICategory>('Category', categorySchema);