import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import InventoryBatch from './inventoryBatch.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('inventory', 'read'), getAll(InventoryBatch));
router.get('/stock', protect, checkPermission('inventory', 'read'), asyncHandler(async (req, res) => {
  const stock = await InventoryBatch.find({ isDeleted: false }).populate('product');
  res.status(200).json(ApiResponse.success('Stock retrieved', stock));
}));
router.get('/:id', protect, checkPermission('inventory', 'read'), getOne(InventoryBatch, { path: 'product' }));
router.post('/', protect, checkPermission('inventory', 'create'), createOne(InventoryBatch));
router.put('/:id', protect, checkPermission('inventory', 'update'), updateOne(InventoryBatch));
router.delete('/:id', protect, checkPermission('inventory', 'delete'), deleteOne(InventoryBatch));

router.get('/stock/all', asyncHandler(async (req, res) => {
  const stock = await InventoryBatch.find({ isDeleted: false }).populate('product');
  res.status(200).json(ApiResponse.success('Stock retrieved', stock));
}));

export default router;
