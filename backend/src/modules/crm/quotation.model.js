import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema({
  quotationNo: { type: String, required: true, unique: true },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  subtotal: Number,
  gstAmount: Number,
  discount: Number,
  totalAmount: Number,
  currency: { type: String, default: '₹' },
  validUntil: Date,
  status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], default: 'Draft' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Quotation', quotationSchema);
