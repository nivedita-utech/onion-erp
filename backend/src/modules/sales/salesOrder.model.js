import mongoose from 'mongoose';

const salesOrderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    rate: { type: Number },
    amount: { type: Number }
  }],
  quotation: { type: String },
  invoiceNo: { type: String },
  gstAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  status: { type: String, enum: ['Quotation', 'Approved', 'Processing', 'Delivered', 'Cancelled'], default: 'Quotation' },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

salesOrderSchema.index({ customer: 1, status: 1 });
salesOrderSchema.index({ createdAt: -1 });

export default mongoose.model('SalesOrder', salesOrderSchema);
