import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  source: { type: String },
  country: { type: String },
  status: { type: String, default: 'New' },
  followUps: [{
    date: Date,
    note: String,
    completed: { type: Boolean, default: false }
  }],
  notes: [{ text: String, date: { type: Date, default: Date.now } }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  convertedToCustomer: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
