import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String },
  grade: { type: String },
  packagingTypes: [{ type: String }],
  domesticPrice: { type: Number },
  exportPrices: [{
    currency: { type: String },
    price: { type: Number }
  }],
  unit: { type: String, default: 'kg' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ category: 1 });
productSchema.index({ name: 'text', sku: 1 });

export default mongoose.model('Product', productSchema);
