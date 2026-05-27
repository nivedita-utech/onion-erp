import mongoose from 'mongoose';

const grnSchema = new mongoose.Schema({
  grnNumber: { type: String, required: true, unique: true },
  purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  receivedItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    expectedQty: { type: Number },
    receivedQty: { type: Number },
    acceptedQty: { type: Number },
    rejectedQty: { type: Number },
    notes: { type: String }
  }],
  qualityCheck: { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
  warehouseEntry: { type: Boolean, default: false },
  receivedDate: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('GRN', grnSchema);
