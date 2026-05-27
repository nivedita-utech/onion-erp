import express from 'express';
import { 
  getProfiles, 
  createProfile, 
  getLabTests, 
  createLabTest, 
  downloadCOA 
} from './quality.controller.js';
import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

router.use(protect);

router.route('/profiles')
  .get(checkPermission('quality', 'read'), getProfiles)
  .post(checkPermission('quality', 'create'), createProfile);

router.route('/tests')
  .get(checkPermission('quality', 'read'), getLabTests)
  .post(checkPermission('quality', 'create'), createLabTest);

router.get('/tests/:id/coa', checkPermission('quality', 'read'), downloadCOA);

export default router;
