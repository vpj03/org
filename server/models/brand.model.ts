import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Brand interface
export interface IBrand extends Document {
  name: string;
  description: string;
  logo: string;
  createdBy: Schema.Types.ObjectId;
}

// Brand schema
const brandSchema = new Schema<IBrand>({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  logo: { 
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

// Create and export the Brand model
export const Brand = mongoose.model<IBrand>('Brand', brandSchema);