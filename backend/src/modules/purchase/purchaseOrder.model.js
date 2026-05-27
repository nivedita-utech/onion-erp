import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  items: [{
    product: { type: String, required: true },
    quantity: { type: Number },
    rate: { type: Number },
    amount: { type: Number }
  }],
  status: { type: String, enum: ['Pending', 'Approved', 'Received', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

purchaseOrderSchema.index({ supplier: 1, status: 1 });
purchaseOrderSchema.index({ createdAt: -1 });

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
