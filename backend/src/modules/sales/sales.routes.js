import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import SalesOrder from './salesOrder.model.js';
import { dispatchOrder } from './sales.controller.js';

import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';

import { validate } from '../../middleware/validate.js';
import { createSalesOrderSchema, updateSalesOrderSchema } from './sales.validation.js';
import PdfService from '../../utils/pdfService.js';
import { auditLogger } from '../../middleware/auditTrail.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/orders', protect, checkPermission('sales', 'read'), getAll(SalesOrder));
router.get('/orders/:id', protect, checkPermission('sales', 'read'), getOne(SalesOrder, { path: 'customer items.product' }));
router.post('/orders', protect, checkPermission('sales', 'create'), validate(createSalesOrderSchema), auditLogger('SalesOrder', 'CREATE'), createOne(SalesOrder));
router.put('/orders/:id', protect, checkPermission('sales', 'update'), validate(updateSalesOrderSchema), auditLogger('SalesOrder', 'UPDATE'), updateOne(SalesOrder));
router.delete('/orders/:id', protect, checkPermission('sales', 'delete'), auditLogger('SalesOrder', 'DELETE'), deleteOne(SalesOrder));

router.post('/orders/:id/dispatch', protect, checkPermission('sales', 'update'), auditLogger('SalesOrder', 'DISPATCH'), dispatchOrder);

// ─── PDF Downloads ─────────────────────────────────
router.get('/orders/:id/invoice.pdf', protect, checkPermission('sales', 'read'), asyncHandler(async (req, res) => {
  const order = await SalesOrder.findById(req.params.id)
    .populate('customer')
    .populate('items.product');
  if (!order) throw new ApiError(404, 'Order not found');
  // Compute subtotal for PDF
  order.subtotal = (order.items || []).reduce((sum, i) => sum + (i.amount || 0), 0);
  PdfService.generateInvoice(res, order);
}));

router.get('/orders/:id/quotation.pdf', asyncHandler(async (req, res) => {
  const order = await SalesOrder.findById(req.params.id)
    .populate('customer')
    .populate('items.product');
  if (!order) throw new ApiError(404, 'Order not found');
  order.subtotal = (order.items || []).reduce((sum, i) => sum + (i.amount || 0), 0);
  PdfService.generateQuotation(res, order);
}));

export default router;
