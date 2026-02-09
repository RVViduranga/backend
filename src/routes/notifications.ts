import express from 'express';
import {
	getNotifications,
	markAsRead
} from '../controllers/notificationController';

const router = express.Router();

// CRUD for notifications
router.get('/', getNotifications);
router.get('/:id', markAsRead);
router.post('/', markAsRead);
router.put('/:id', markAsRead);
router.delete('/:id', markAsRead);

export default router;
