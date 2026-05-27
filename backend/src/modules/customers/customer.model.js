import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String },
  email: { type: String },
  source: { type: String },
  country: { type: String },
  billingAddress: { type: String },
  shippingAddress: { type: String },
  creditLimit: { type: Number, default: 0 },
  paymentTerms: { type: String },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SalesOrder' }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

customerSchema.index({ name: 'text', email: 'text' });
customerSchema.index({ assignedTo: 1 });

export default mongoose.model('Customer', customerSchema);
