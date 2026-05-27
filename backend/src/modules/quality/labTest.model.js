import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionBatch', required: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'QualityProfile', required: true },
  testDate: { type: Date, default: Date.now },
  testedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  results: [{
    parameterName: { type: String, required: true },
    value: { type: Number },
    status: { type: String, enum: ['Pass', 'Fail'] }
  }],
  microbialResults: [{
    parameterName: { type: String },
    value: { type: String },
    status: { type: String, enum: ['Pass', 'Fail'] }
  }],
  overallStatus: { type: String, enum: ['Pass', 'Fail'], default: 'Pass' },
  remarks: { type: String },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('LabTest', labTestSchema);
