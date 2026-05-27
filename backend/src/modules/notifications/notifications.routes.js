import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from './notification.controller.js';

const router = express.Router();

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
