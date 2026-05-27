import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Customer from './customer.model.js';
import SalesOrder from '../sales/salesOrder.model.js';
import Payment from '../accounts/payment.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import { validate } from '../../middleware/validate.js';
import { createCustomerSchema, updateCustomerSchema } from './customers.validation.js';
import { auditLogger } from '../../middleware/auditTrail.js';
import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('customers', 'read'), getAll(Customer));
router.get('/:id', protect, checkPermission('customers', 'read'), getOne(Customer));
router.post('/', protect, checkPermission('customers', 'create'), validate(createCustomerSchema), auditLogger('Customer', 'CREATE'), createOne(Customer));
router.put('/:id', protect, checkPermission('customers', 'update'), validate(updateCustomerSchema), auditLogger('Customer', 'UPDATE'), updateOne(Customer));
router.delete('/:id', protect, checkPermission('customers', 'delete'), auditLogger('Customer', 'DELETE'), deleteOne(Customer));

router.get('/:id/orders', asyncHandler(async (req, res) => {
  const orders = await SalesOrder.find({ customer: req.params.id, isDeleted: false });
  res.status(200).json(ApiResponse.success('Orders retrieved', orders));
}));

router.get('/:id/payments', asyncHandler(async (req, res) => {
  const payments = await Payment.find({ customer: req.params.id, isDeleted: false }); // Needs ref fixing if needed
  res.status(200).json(ApiResponse.success('Payments retrieved', payments));
}));

export default router;
