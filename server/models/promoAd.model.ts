import { mongoose } from '../db';
import { Schema, Document } from 'mongoose';

// PromoAd interface
export interface IPromoAd extends Document {
  title: string;
  description: string | null;
  image: string;
  buttonText: string | null;
  active: boolean;
  createdBy: Schema.Types.ObjectId;
}

// PromoAd schema
const promoAdSchema = new Schema<IPromoAd>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: null 
  },
  image: { 
    type: String, 
    required: true 
  },
  buttonText: { 
    type: String, 
    default: null 
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

// Create and export the PromoAd model
export const PromoAd = mongoose.model<IPromoAd>('PromoAd', promoAdSchema);