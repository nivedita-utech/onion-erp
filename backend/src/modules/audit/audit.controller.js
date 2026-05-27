import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import AuditLog from './auditLog.model.js';

/**
 * @desc    Get audit logs
 * @route   GET /api/audit
 * @access  Private (Admin)
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Basic filtering
  const filter = {};
  if (req.query.module) filter.module = req.query.module;
  if (req.query.action) filter.action = req.query.action;
  
  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    // .populate('user', 'name email role')   // Pending Phase 2 User model
    .skip(skip)
    .limit(limit);

  const total = await AuditLog.countDocuments(filter);

  res.status(200).json(ApiResponse.success('Audit logs retrieved successfully', logs, {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  }));
});
