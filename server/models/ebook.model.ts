import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// Ebook interface
export interface IEbook extends Document {
  title: string;
  description: string;
  image: string;
  price: number;
  fileUrl: string;
  createdBy: Schema.Types.ObjectId;
}

// Ebook schema
const ebookSchema = new Schema<IEbook>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    default: 0 
  },
  fileUrl: { 
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

// Create and export the Ebook model
export const Ebook = mongoose.model<IEbook>('Ebook', ebookSchema);