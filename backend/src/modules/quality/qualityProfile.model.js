import mongoose from 'mongoose';

const qualityProfileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Premium Grade, Standard Grade
  productGrade: { type: String, required: true }, // Links to Product's grade field
  parameters: [{
    name: { type: String, required: true }, // e.g., Moisture Content
    unit: { type: String }, // e.g., %
    min: { type: Number },
    max: { type: Number },
    required: { type: Boolean, default: true }
  }],
  microbialSpecs: [{
    name: { type: String }, // e.g., TPC
    limit: { type: String }, // e.g., < 50,000 cfu/g
    required: { type: Boolean, default: true }
  }],
  isDefault: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('QualityProfile', qualityProfileSchema);
