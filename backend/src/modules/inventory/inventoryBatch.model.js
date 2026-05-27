import mongoose from 'mongoose';

const inventoryBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  warehouse: { type: String },
  productionDate: { type: Date },
  expiryDate: { type: Date },
  movementLog: [{
    type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'] },
    quantity: Number,
    date: { type: Date, default: Date.now },
    notes: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  qualityStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('InventoryBatch', inventoryBatchSchema);
