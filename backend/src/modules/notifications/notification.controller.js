import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import Notification from './notification.model.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  // Using dummy user auth for now until Phase 2 Auth is completely wired
  const userId = req.user?._id || '651234567890123456789012'; 
  
  const notifications = await Notification.find({ user: userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(50);
    
  res.status(200).json(ApiResponse.success('Notifications retrieved successfully', notifications));
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json(ApiResponse.error('Notification not found'));
  }

  res.status(200).json(ApiResponse.success('Notification marked as read', notification));
});

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user?._id || '651234567890123456789012';
  
  await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  res.status(200).json(ApiResponse.success('All notifications marked as read', null));
});
