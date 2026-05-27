import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import { startProduction, completeProduction } from './production.controller.js';
import ProductionBatch from './productionBatch.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('production', 'read'), asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { isDeleted: false };
  if (status) query.status = status;
  
  const docs = await ProductionBatch.find(query).populate('product').sort({ createdAt: -1 });
  res.status(200).json(ApiResponse.success('Retrieved all successfully', docs));
}));

router.get('/summary', protect, checkPermission('production', 'read'), asyncHandler(async (req, res) => {
  const batches = await ProductionBatch.find({ isDeleted: false });
  const totalQty = batches.reduce((sum, b) => sum + (b.outputQuantity || 0), 0);
  
  // Group by month for chart
  const monthlyOutput = batches.reduce((acc, b) => {
    const month = new Date(b.createdAt).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + (b.outputQuantity || 0);
    return acc;
  }, {});

  const chartData = Object.entries(monthlyOutput).map(([name, output]) => ({ name, output }));

  res.status(200).json(ApiResponse.success('Production summary retrieved', {
    totalOutput: totalQty,
    monthlyOutput: chartData
  }));
}));

router.get('/:id', protect, checkPermission('production', 'read'), getOne(ProductionBatch, { path: 'product' }));
router.post('/', protect, checkPermission('production', 'create'), createOne(ProductionBatch));
router.put('/:id', protect, checkPermission('production', 'update'), updateOne(ProductionBatch));
router.delete('/:id', protect, checkPermission('production', 'delete'), deleteOne(ProductionBatch));

router.post('/:id/start', protect, checkPermission('production', 'update'), startProduction);
router.post('/:id/complete', protect, checkPermission('production', 'update'), completeProduction);

router.put('/:id/stage', protect, checkPermission('production', 'update'), asyncHandler(async (req, res) => {
  const batch = await ProductionBatch.findByIdAndUpdate(
    req.params.id, 
    { $push: { stages: { name: req.body.name, status: req.body.status, completedAt: new Date() } } },
    { new: true }
  );
  res.status(200).json(ApiResponse.success('Stage updated', batch));
}));

export default router;
