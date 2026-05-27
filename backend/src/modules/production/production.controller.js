import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import ProductionBatch from './productionBatch.model.js';
import InventoryBatch from '../inventory/inventoryBatch.model.js';
import mongoose from 'mongoose';

/**
 * Start Production - Deduct raw materials from inventory
 */
export const startProduction = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const batch = await ProductionBatch.findById(id).session(session);

    if (!batch) throw new ApiError(404, 'Production batch not found');
    if (batch.status !== 'Planned') throw new ApiError(400, 'Batch already started or completed');

    if (!batch.rawMaterialProduct || !batch.rawMaterialQty) {
      throw new ApiError(400, 'Raw material details missing');
    }

    // Deduct raw material from inventory
    const inventoryBatch = await InventoryBatch.findOne({ 
      product: batch.rawMaterialProduct,
      quantity: { $gte: batch.rawMaterialQty },
      isDeleted: false 
    }).session(session);

    if (!inventoryBatch) {
      throw new ApiError(400, `Insufficient raw material stock. Needed: ${batch.rawMaterialQty}`);
    }

    inventoryBatch.quantity -= batch.rawMaterialQty;
    inventoryBatch.movementLog.push({
      type: 'OUT',
      quantity: batch.rawMaterialQty,
      notes: `Issued to Production Batch: ${batch.batchId}`,
      user: req.user?._id
    });
    await inventoryBatch.save({ session });

    // Update status
    batch.status = 'Ongoing';
    if (batch.stages && batch.stages.length > 0) {
      batch.stages[0].status = 'In Progress';
    }
    await batch.save({ session });

    await session.commitTransaction();
    res.status(200).json(ApiResponse.success('Production started, material issued', batch));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * Complete Production - Add finished goods to inventory
 */
export const completeProduction = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { outputQty, wastage } = req.body;
    const batch = await ProductionBatch.findById(id).session(session);

    if (!batch) throw new ApiError(404, 'Production batch not found');
    if (batch.status !== 'Ongoing') throw new ApiError(400, 'Batch must be in Ongoing status');

    // Update batch details
    batch.outputQty = outputQty;
    batch.wastage = wastage;
    batch.status = 'Completed';
    if (batch.stages) {
      batch.stages.forEach(s => s.status = 'Completed');
    }
    await batch.save({ session });

    // Add finished goods to inventory
    let inventoryBatch = await InventoryBatch.findOne({ 
      product: batch.product,
      isDeleted: false 
    }).session(session);

    if (inventoryBatch) {
      inventoryBatch.quantity += outputQty;
      inventoryBatch.movementLog.push({
        type: 'IN',
        quantity: outputQty,
        notes: `Production Output - Batch: ${batch.batchId}`,
        user: req.user?._id
      });
      await inventoryBatch.save({ session });
    } else {
      await InventoryBatch.create([{
        batchId: `PROD-${batch.batchId}`,
        product: batch.product,
        quantity: outputQty,
        movementLog: [{
          type: 'IN',
          quantity: outputQty,
          notes: `Initial stock from Production Batch: ${batch.batchId}`,
          user: req.user?._id
        }]
      }], { session });
    }

    await session.commitTransaction();
    res.status(200).json(ApiResponse.success('Production completed, finished goods added to inventory', batch));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
