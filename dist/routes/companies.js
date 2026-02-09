"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const companyController_1 = require("../controllers/companyController");
const router = express_1.default.Router();
// Create company
router.post('/', companyController_1.createCompany);
// Company profile (requires authentication)
router.get('/profile', auth_1.default, companyController_1.getCompanyProfile);
router.patch('/profile', auth_1.default, companyController_1.updateCompanyProfile);
// Company info
router.get('/:id', companyController_1.getCompanyById);
router.get('/', companyController_1.getCompanies);
// Company jobs
router.post('/jobs', companyController_1.createCompanyJob);
router.get('/jobs', companyController_1.getCompanyJobs);
router.post('/', companyController_1.createCompanyJob); // 
router.get('/jobs/:id', companyController_1.getCompanyJobById);
router.patch('/jobs/:id', companyController_1.updateCompanyJobById);
router.delete('/jobs/:id', companyController_1.deleteCompanyJobById);
// Company applications
router.get('/applications', companyController_1.getCompanyApplications);
router.get('/jobs/:id/applications', companyController_1.getJobApplications);
exports.default = router;
