import mongoose from 'mongoose';

const productionBatchSchema = new mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rawMaterialProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  rawMaterialQty: { type: Number },
  outputQty: { type: Number },
  wastage: { type: Number },
  stages: [{
    name: { type: String },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'] },
    completedAt: { type: Date }
  }],
  status: { type: String, enum: ['Planned', 'Ongoing', 'Completed'], default: 'Planned' },
  qualityStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  labTest: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('ProductionBatch', productionBatchSchema);
