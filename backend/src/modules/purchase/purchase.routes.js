import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import { createGRN } from './purchase.controller.js';
import PurchaseOrder from './purchaseOrder.model.js';
import Supplier from './supplier.model.js';
import GRN from './grn.model.js';
import { validate } from '../../middleware/validate.js';
import {
  createPurchaseOrderSchema,
  updatePurchaseOrderSchema,
  createSupplierSchema,
  updateSupplierSchema
} from './purchase.validation.js';
import { auditLogger } from '../../middleware/auditTrail.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

// Purchase Orders Routes
router.get('/purchase-orders', protect, checkPermission('purchase', 'read'), getAll(PurchaseOrder));
router.get('/purchase-orders/:id', protect, checkPermission('purchase', 'read'), getOne(PurchaseOrder));
router.post('/purchase-orders', protect, checkPermission('purchase', 'create'), validate(createPurchaseOrderSchema), auditLogger('PurchaseOrder', 'CREATE'), createOne(PurchaseOrder));
router.put('/purchase-orders/:id', protect, checkPermission('purchase', 'update'), validate(updatePurchaseOrderSchema), auditLogger('PurchaseOrder', 'UPDATE'), updateOne(PurchaseOrder));
router.delete('/purchase-orders/:id', protect, checkPermission('purchase', 'delete'), auditLogger('PurchaseOrder', 'DELETE'), deleteOne(PurchaseOrder));

// Supplier Routes
router.get('/suppliers', protect, checkPermission('purchase', 'read'), getAll(Supplier));
router.get('/suppliers/:id', protect, checkPermission('purchase', 'read'), getOne(Supplier));
router.post('/suppliers', protect, checkPermission('purchase', 'create'), validate(createSupplierSchema), auditLogger('Supplier', 'CREATE'), createOne(Supplier));
router.put('/suppliers/:id', protect, checkPermission('purchase', 'update'), validate(updateSupplierSchema), auditLogger('Supplier', 'UPDATE'), updateOne(Supplier));
router.delete('/suppliers/:id', protect, checkPermission('purchase', 'delete'), auditLogger('Supplier', 'DELETE'), deleteOne(Supplier));

// GRN Routes
router.get('/grn', getAll(GRN));
router.get('/grn/:id', getOne(GRN));
router.post('/grn', auditLogger('GRN', 'CREATE'), createGRN);

export default router;
