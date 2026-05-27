import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  gst: { type: String },
  products: [{ type: String }],
  paymentTerms: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Supplier', supplierSchema);
