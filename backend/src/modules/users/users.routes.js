import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import User from './user.model.js';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('settings', 'read'), getAll(User));
router.get('/:id', protect, checkPermission('settings', 'read'), getOne(User, { path: 'role company' }));
router.post('/', protect, checkPermission('settings', 'create'), createOne(User));
router.put('/:id', protect, checkPermission('settings', 'update'), updateOne(User));
router.delete('/:id', protect, checkPermission('settings', 'delete'), deleteOne(User));

// update role specifically
router.put('/:id/role', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
  res.status(200).json(ApiResponse.success('Role updated', user));
}));

// reset password
router.put('/:id/reset-password', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json(ApiResponse.error('User not found'));
  }
  user.password = req.body.password;
  await user.save();
  res.status(200).json(ApiResponse.success('Password updated successfully'));
}));

export default router;
