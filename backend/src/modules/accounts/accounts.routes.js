import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Payment from './payment.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/payments', protect, checkPermission('accounts', 'read'), getAll(Payment));
router.get('/payments/:id', protect, checkPermission('accounts', 'read'), getOne(Payment));
router.post('/payment', protect, checkPermission('accounts', 'create'), createOne(Payment));

router.get('/receivables', protect, checkPermission('accounts', 'read'), asyncHandler(async (req, res) => {
  const receivables = await Payment.find({ type: 'receivable', isDeleted: false });
  res.status(200).json(ApiResponse.success('Receivables retrieved', receivables));
}));

router.get('/payables', protect, checkPermission('accounts', 'read'), asyncHandler(async (req, res) => {
  const payables = await Payment.find({ type: 'payable', isDeleted: false });
  res.status(200).json(ApiResponse.success('Payables retrieved', payables));
}));

router.get('/summary', protect, checkPermission('accounts', 'read'), asyncHandler(async (req, res) => {
  const stats = await Payment.aggregate([
    { $match: { isDeleted: false, status: 'Completed' } },
    {
      $group: {
        _id: null,
        totalReceivable: {
          $sum: { $cond: [{ $eq: ['$type', 'receivable'] }, '$amount', 0] }
        },
        totalPayable: {
          $sum: { $cond: [{ $eq: ['$type', 'payable'] }, '$amount', 0] }
        }
      }
    }
  ]);

  const summary = stats[0] || { totalReceivable: 0, totalPayable: 0 };
  
  res.status(200).json(ApiResponse.success('Financial summary retrieved', {
    revenue: summary.totalReceivable,
    expenses: summary.totalPayable,
    netProfit: summary.totalReceivable - summary.totalPayable
  }));
}));

export default router;
