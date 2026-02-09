import express = require('express');
import auth from '../middleware/auth';
import {
	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,
	getCVs,
	setPrimaryCV,
	deleteCV,
	uploadCV
} from '../controllers/userController';
import { uploadCV as uploadCVMiddleware } from '../middleware/upload';

const router = express.Router();

// CV management routes (must come BEFORE /:id route to avoid route conflict)
router.get('/cv', auth, getCVs);
router.post('/cv/upload', auth, uploadCVMiddleware.single('file'), uploadCV);
router.post('/cv/:id/primary', auth, setPrimaryCV);
router.delete('/cv/:id', auth, deleteCV);

// CRUD for users (must come AFTER specific routes)
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
