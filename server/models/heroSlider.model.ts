import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// HeroSlider interface
export interface IHeroSlider extends Document {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  active: boolean;
  createdBy: Schema.Types.ObjectId;
}

// HeroSlider schema
const heroSliderSchema = new Schema<IHeroSlider>({
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
  buttonText: { 
    type: String, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

// Create and export the HeroSlider model
export const HeroSlider = mongoose.model<IHeroSlider>('HeroSlider', heroSliderSchema);