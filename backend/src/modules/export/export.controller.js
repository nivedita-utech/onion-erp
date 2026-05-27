import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import ExportOrder from './exportOrder.model.js';
import InventoryBatch from '../inventory/inventoryBatch.model.js';
import mongoose from 'mongoose';

/**
 * Dispatch Export Order - Deduct finished goods from inventory
 */
export const dispatchExportOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const order = await ExportOrder.findById(id).session(session);

    if (!order) throw new ApiError(404, 'Export Order not found');
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      throw new ApiError(400, 'Order already dispatched');
    }

    // Deduct each item from inventory
    for (const item of order.items) {
      const inventoryBatch = await InventoryBatch.findOne({ 
        product: item.product,
        quantity: { $gte: item.quantity },
        isDeleted: false 
      }).session(session);

      if (!inventoryBatch) {
        throw new ApiError(400, `Insufficient stock for product ${item.product}. Needed: ${item.quantity}`);
      }

      inventoryBatch.quantity -= item.quantity;
      inventoryBatch.movementLog.push({
        type: 'OUT',
        quantity: item.quantity,
        notes: `Dispatch Export Order: ${order.orderNo || order._id}`,
        user: req.user?._id
      });
      await inventoryBatch.save({ session });
    }

    // Update order status
    order.status = 'Shipped';
    order.shipmentStatus = 'In Transit';
    await order.save({ session });

    await session.commitTransaction();
    res.status(200).json(ApiResponse.success('Export order dispatched and Inventory updated', order));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
