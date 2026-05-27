import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Role from './role.model.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('settings', 'read'), getAll(Role));
router.get('/:id', protect, checkPermission('settings', 'read'), getOne(Role));
router.post('/', protect, checkPermission('settings', 'create'), createOne(Role));
router.put('/:id', protect, checkPermission('settings', 'update'), updateOne(Role));
router.delete('/:id', protect, checkPermission('settings', 'delete'), deleteOne(Role));

export default router;
