import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import ExportOrder from './exportOrder.model.js';
import { dispatchExportOrder } from './export.controller.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import PdfService from '../../utils/pdfService.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('export', 'read'), asyncHandler(async (req, res) => {
  const docs = await ExportOrder.find({ isDeleted: false })
    .populate('customer')
    .populate('items.product')
    .sort({ createdAt: -1 });
  res.status(200).json(ApiResponse.success('Retrieved all successfully', docs));
}));
router.get('/:id', protect, checkPermission('export', 'read'), getOne(ExportOrder, { path: 'customer' }));
router.post('/', protect, checkPermission('export', 'create'), createOne(ExportOrder));
router.put('/:id', protect, checkPermission('export', 'update'), updateOne(ExportOrder));
router.delete('/:id', protect, checkPermission('export', 'delete'), deleteOne(ExportOrder));

router.post('/:id/dispatch', protect, checkPermission('export', 'update'), dispatchExportOrder);

// ─── PDF Downloads ─────────────────────────────────
router.get('/:id/packing-list.pdf', protect, checkPermission('export', 'read'), asyncHandler(async (req, res) => {
  const order = await ExportOrder.findById(req.params.id)
    .populate('customer')
    .populate('items.product');
  if (!order) throw new ApiError(404, 'Export order not found');
  order.subtotal = (order.items || []).reduce((sum, i) => sum + (i.amount || 0), 0);
  PdfService.generatePackingList(res, order);
}));

router.get('/:id/proforma-invoice.pdf', protect, checkPermission('export', 'read'), asyncHandler(async (req, res) => {
  const order = await ExportOrder.findById(req.params.id)
    .populate('customer')
    .populate('items.product');
  if (!order) throw new ApiError(404, 'Export order not found');
  order.subtotal = (order.items || []).reduce((sum, i) => sum + (i.amount || 0), 0);
  PdfService.generateQuotation(res, order);
}));

router.get('/:id/tracking', protect, checkPermission('export', 'read'), asyncHandler(async (req, res) => {
  const order = await ExportOrder.findById(req.params.id);
  res.status(200).json(ApiResponse.success('Tracking info retrieved', { shipmentStatus: order.shipmentStatus, containerNo: order.containerNo }));
}));

export default router;
