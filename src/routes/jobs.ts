import express from 'express';

import auth from '../middleware/auth';
import role from '../middleware/role';

import { Router } from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob, searchJobs, applyToJob, getRelatedJobs } from "../controllers/jobController";

const router = Router();




// Public

router.get('/search', searchJobs); // <-- must be before /:id
router.get('/', getJobs);
router.post('/:id/apply', applyToJob);
router.get('/:id/related', getRelatedJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
