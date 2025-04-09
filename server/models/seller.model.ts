import mongoose, { Schema, Document } from 'mongoose';

export interface ISeller extends Document {
  userId: mongoose.Types.ObjectId;
  personalDetails: any; // Adjust types as needed
  businessDetails: {
    status: string;
    // ... other business fields ...
  };
}

const sellerSchema = new Schema<ISeller>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  personalDetails: { type: Object, required: true },
  businessDetails: { type: Object, required: true }
}, { timestamps: true });

const Seller = mongoose.model<ISeller>('Seller', sellerSchema);
export default Seller;