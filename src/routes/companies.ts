import express from 'express';
import auth from '../middleware/auth';

import {
	getCompanies,
	getCompanyById,
	getCompanyProfile,
	updateCompanyProfile,
	createCompanyJob,
	createCompany,
	getCompanyJobs,
	getCompanyJobById,
	updateCompanyJobById,
	deleteCompanyJobById,
	getCompanyApplications,
	getJobApplications,
} from '../controllers/companyController';


const router = express.Router();

// Create company
router.post('/', createCompany);


// Company profile (requires authentication)
router.get('/profile', auth, getCompanyProfile);
router.patch('/profile', auth, updateCompanyProfile);

// Company info - specific routes before dynamic routes
router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Company jobs
router.post('/jobs', createCompanyJob);
router.get('/jobs', getCompanyJobs);
router.post('/', createCompanyJob); // 
router.get('/jobs/:id', getCompanyJobById);
router.patch('/jobs/:id', updateCompanyJobById);
router.delete('/jobs/:id', deleteCompanyJobById);

// Company applications
router.get('/applications', getCompanyApplications);
router.get('/jobs/:id/applications', getJobApplications);



export default router;
