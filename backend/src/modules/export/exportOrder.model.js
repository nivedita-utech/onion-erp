import mongoose from 'mongoose';

const exportOrderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    rate: { type: Number },
    amount: { type: Number }
  }],
  currency: { type: String, default: 'USD' },
  shippingTerm: { type: String, enum: ['FOB', 'CIF', 'EXW'] },
  containerNo: { type: String },
  blNo: { type: String },
  shipmentStatus: { type: String, enum: ['Booked', 'Loaded', 'Departed', 'In Transit', 'Arrived', 'Cleared', 'Delivered'], default: 'Booked' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ExportOrder', exportOrderSchema);
