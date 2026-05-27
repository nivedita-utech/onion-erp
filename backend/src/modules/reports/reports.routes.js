import express from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';

import { protect } from '../../middleware/auth.js';
import { checkPermission } from '../../middleware/rbac.js';

const router = express.Router();

// Stubs for Phase 8 reports to avoid 404s
router.get('/sales-report', protect, checkPermission('reports', 'read'), asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Sales report generated', []));
}));

router.get('/purchase-report', protect, checkPermission('reports', 'read'), asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Purchase report generated', []));
}));

router.get('/inventory-report', protect, checkPermission('reports', 'read'), asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Inventory report generated', []));
}));

router.get('/export-performance', protect, checkPermission('reports', 'read'), asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Export performance generated', []));
}));

router.get('/profit-loss', protect, checkPermission('reports', 'read'), asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success('Profit Loss generated', []));
}));

export default router;
