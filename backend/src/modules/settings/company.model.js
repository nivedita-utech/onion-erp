import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  gstNo: { type: String },
  iecCode: { type: String },
  address: { type: String },
  branches: [{ type: String }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
