import express from 'express';
import {
	uploadFile,
	getFile
} from '../controllers/uploadController';

const router = express.Router();

// CRUD for uploads
router.get('/', getFile);
router.get('/:id', getFile);
router.post('/', uploadFile);
router.put('/:id', uploadFile);
router.delete('/:id', uploadFile);

export default router;
