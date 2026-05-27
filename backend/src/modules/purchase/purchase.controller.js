import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import GRN from './grn.model.js';
import PurchaseOrder from './purchaseOrder.model.js';
import InventoryBatch from '../inventory/inventoryBatch.model.js';
import mongoose from 'mongoose';

/**
 * Create a new GRN and automatically update Inventory
 */
export const createGRN = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { purchaseOrder, receivedItems, grnNumber } = req.body;

    // 1. Create the GRN
    const grn = await GRN.create([req.body], { session });

    // 2. Update Purchase Order status to 'Received'
    await PurchaseOrder.findByIdAndUpdate(
      purchaseOrder,
      { status: 'Received' },
      { session }
    );

    // 3. Update Inventory for each accepted item
    for (const item of receivedItems) {
      if (item.acceptedQty > 0) {
        // Find or create an inventory batch for this product
        // In a real ERP, we might create unique batches (e.g., by date/serial)
        // Here we'll update based on product to keep it a bit simpler for the demo
        let inventoryBatch = await InventoryBatch.findOne({ 
          product: item.product,
          isDeleted: false 
        }).session(session);

        if (inventoryBatch) {
          // Update existing batch
          inventoryBatch.quantity += item.acceptedQty;
          inventoryBatch.movementLog.push({
            type: 'IN',
            quantity: item.acceptedQty,
            notes: `Received via GRN: ${grnNumber}`,
            user: req.user?._id
          });
          await inventoryBatch.save({ session });
        } else {
          // Create new batch if none exists
          await InventoryBatch.create([{
            batchId: `BATCH-${Date.now()}-${item.product.toString().slice(-4)}`,
            product: item.product,
            quantity: item.acceptedQty,
            movementLog: [{
              type: 'IN',
              quantity: item.acceptedQty,
              notes: `Initial stock from GRN: ${grnNumber}`,
              user: req.user?._id
            }]
          }], { session });
        }
      }
    }

    await session.commitTransaction();
    res.status(201).json(ApiResponse.success('GRN created and Inventory updated successfully', grn[0]));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
