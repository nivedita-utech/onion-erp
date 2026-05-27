import express from 'express';
import { createOne, getOne, getAll, updateOne, deleteOne } from '../../utils/crudFactory.js';
import Product from './product.model.js';
import { validate } from '../../middleware/validate.js';
import { createProductSchema, updateProductSchema } from './products.validation.js';
import { auditLogger } from '../../middleware/auditTrail.js';
import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', protect, checkPermission('products', 'read'), getAll(Product));
router.get('/:id', protect, checkPermission('products', 'read'), getOne(Product));
router.post('/', protect, checkPermission('products', 'create'), validate(createProductSchema), auditLogger('Product', 'CREATE'), createOne(Product));
router.put('/:id', protect, checkPermission('products', 'update'), validate(updateProductSchema), auditLogger('Product', 'UPDATE'), updateOne(Product));
router.delete('/:id', protect, checkPermission('products', 'delete'), auditLogger('Product', 'DELETE'), deleteOne(Product));

export default router;
