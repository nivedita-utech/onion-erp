import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Lead from './lead.model.js';
import Customer from '../customers/customer.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('leads', 'read'), getAll(Lead));
router.get('/:id', protect, checkPermission('leads', 'read'), getOne(Lead));
router.post('/', protect, checkPermission('leads', 'create'), createOne(Lead));
router.put('/:id', protect, checkPermission('leads', 'update'), updateOne(Lead));
router.delete('/:id', protect, checkPermission('leads', 'delete'), deleteOne(Lead));

router.put('/:id/status', protect, checkPermission('leads', 'update'), asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.status(200).json(ApiResponse.success('Status updated', lead));
}));

router.post('/:id/followup', asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id, 
    { $push: { followUps: { date: req.body.date, note: req.body.note } } },
    { new: true }
  );
  res.status(200).json(ApiResponse.success('Follow up added', lead));
}));

router.post('/:id/convert', asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new ApiError(404, 'Lead not found');
  if (lead.convertedToCustomer) throw new ApiError(400, 'Lead already converted');

  lead.convertedToCustomer = true;
  await lead.save();

  const customer = await Customer.create({
    name: lead.name,
    email: lead.email,
    contactPerson: lead.name,
    source: lead.source,
    country: lead.country,
    assignedTo: lead.assignedTo
  });

  res.status(200).json(ApiResponse.success('Lead converted to Customer', customer));
}));

export default router;
