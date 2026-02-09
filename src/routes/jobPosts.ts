import express from 'express';
import {
	createJob,
	updateJob,
	deleteJob,
	getJobs
} from '../controllers/jobPostController';

const router = express.Router();

// CRUD for job posts
router.get('/', getJobs);
router.get('/:id', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
