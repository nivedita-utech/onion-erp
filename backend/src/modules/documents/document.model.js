import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    attachedTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    attachedModel: {
      type: String,
      required: true,
      enum: ['SalesOrder', 'ExportOrder', 'Customer', 'Supplier'],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
