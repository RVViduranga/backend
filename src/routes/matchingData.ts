import express from 'express';
import {
	getMatchingData,
	createMatchingData
} from '../controllers/matchingDataController';

const router = express.Router();

// CRUD for matching data
router.get('/', getMatchingData);
router.get('/:id', getMatchingData);
router.post('/', createMatchingData);
router.put('/:id', createMatchingData);
router.delete('/:id', createMatchingData);

export default router;
