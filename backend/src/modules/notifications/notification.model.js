import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['low_stock', 'payment_due', 'followup_reminder', 'order_status', 'shipment_update'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['Product', 'Lead', 'SalesOrder', 'ExportOrder', 'Payment'], // Adjust based on needs
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
