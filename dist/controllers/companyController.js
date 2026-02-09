"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanies = exports.getJobApplications = exports.getCompanyApplications = exports.deleteCompanyJobById = exports.updateCompanyJobById = exports.getCompanyJobById = exports.getCompanyJobs = exports.createCompanyJob = exports.updateCompanyProfile = exports.getCompanyProfile = exports.createCompany = void 0;
// Create company (for POST /api/companies)
const Company_1 = __importDefault(require("../models/Company"));
const User_1 = __importDefault(require("../models/User"));
const createCompany = async (req, res, next) => {
    try {
        const { name, description, location, website, logoUrl, headerImageUrl, headquarters, establishedYear, employeeCountRange, industry } = req.body;
        if (!name || !description || !location) {
            return res.status(400).json({ success: false, data: null, message: "Missing required fields" });
        }
        const company = await Company_1.default.create({
            name,
            description,
            location,
            website,
            logoUrl,
            headerImageUrl,
            headquarters,
            establishedYear,
            employeeCountRange,
            industry
        });
        res.status(201).json({ success: true, data: company, message: "Company created successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.createCompany = createCompany;
// --- New Company Endpoints ---
const getCompanyProfile = async (req, res, next) => {
    try {
        // Get userId from JWT token (set by auth middleware)
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, data: null, message: "Unauthorized" });
        }
        // Get user's fullName to find matching company
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, data: null, message: "User not found" });
        }
        // Find company where name matches user's fullName
        // During registration, we set fullName = companyName, so this should match
        const company = await Company_1.default.findOne({ name: user.fullName });
        if (!company) {
            return res.status(404).json({ success: false, data: null, message: "Company profile not found" });
        }
        res.status(200).json({ success: true, data: company, message: "Company profile fetched successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.getCompanyProfile = getCompanyProfile;
const updateCompanyProfile = (req, res, next) => {
    // TODO: Implement update company profile for authenticated company
    res.sendSuccess(null, 'updateCompanyProfile not implemented');
};
exports.updateCompanyProfile = updateCompanyProfile;
const createCompanyJob = (req, res, next) => {
    // TODO: Implement create job for company
    res.sendSuccess(null, 'createCompanyJob not implemented');
};
exports.createCompanyJob = createCompanyJob;
const getCompanyJobs = (req, res, next) => {
    // TODO: Implement get all jobs for company
    res.sendSuccess(null, 'getCompanyJobs not implemented');
};
exports.getCompanyJobs = getCompanyJobs;
const getCompanyJobById = (req, res, next) => {
    // TODO: Implement get job by id for company
    res.sendSuccess(null, 'getCompanyJobById not implemented');
};
exports.getCompanyJobById = getCompanyJobById;
const updateCompanyJobById = (req, res, next) => {
    // TODO: Implement update job by id for company
    res.sendSuccess(null, 'updateCompanyJobById not implemented');
};
exports.updateCompanyJobById = updateCompanyJobById;
const deleteCompanyJobById = (req, res, next) => {
    // TODO: Implement delete job by id for company
    res.sendSuccess(null, 'deleteCompanyJobById not implemented');
};
exports.deleteCompanyJobById = deleteCompanyJobById;
const getCompanyApplications = (req, res, next) => {
    // TODO: Implement get all applications for company
    res.sendSuccess(null, 'getCompanyApplications not implemented');
};
exports.getCompanyApplications = getCompanyApplications;
const getJobApplications = (req, res, next) => {
    // TODO: Implement get all applications for a job (company)
    res.sendSuccess(null, 'getJobApplications not implemented');
};
exports.getJobApplications = getJobApplications;
const paginationService_1 = require("../services/paginationService");
const getCompanies = async (req, res, next) => {
    try {
        const result = await (0, paginationService_1.getPaginatedData)(Company_1.default, req.query);
        res.sendSuccess(result, 'Companies fetched');
    }
    catch (err) {
        next(err);
    }
};
exports.getCompanies = getCompanies;
const getCompanyById = (req, res, next) => {
    Company_1.default.findById(req.params.id)
        .then(company => {
        if (!company) {
            return res.status(404).json({ success: false, data: null, message: "Company not found" });
        }
        res.status(200).json({ success: true, data: company, message: "Company fetched" });
    })
        .catch(err => {
        next(err);
    });
};
exports.getCompanyById = getCompanyById;
const updateCompany = (req, res, next) => {
    // TODO: Implement update company logic
    res.sendSuccess(null, 'updateCompany not implemented');
};
exports.updateCompany = updateCompany;
const deleteCompany = (req, res, next) => {
    // TODO: Implement delete company logic
    res.sendSuccess(null, 'deleteCompany not implemented');
};
exports.deleteCompany = deleteCompany;
