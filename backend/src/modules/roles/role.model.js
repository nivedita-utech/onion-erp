import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{
    module: { type: String, required: true },
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  }],
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
