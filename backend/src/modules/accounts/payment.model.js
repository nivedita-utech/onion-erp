import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  refId: { type: mongoose.Schema.Types.ObjectId },
  refModel: { type: String, enum: ['SalesOrder', 'PurchaseOrder', 'ExportOrder'] },
  amount: { type: Number, required: true },
  method: { type: String },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ['receivable', 'payable'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
  notes: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
