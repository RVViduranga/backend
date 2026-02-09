"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedJobs = exports.applyToJob = exports.searchJobs = exports.deleteJob = exports.updateJob = exports.getJobById = exports.getJobs = exports.createJob = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("../models/Job"));
// CREATE JOB
const createJob = async (req, res) => {
    try {
        const { title, company, location, jobType, industry, experienceLevel, description, responsibilities, qualifications, salaryRange, applicationDeadline, } = req.body;
        if (!title ||
            !company ||
            !location ||
            !jobType ||
            !description ||
            !salaryRange ||
            !applicationDeadline) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(company)) {
            return res.status(400).json({ message: "Invalid company ID" });
        }
        // Check for duplicate job for the same company with all fields matching
        const duplicateJob = await Job_1.default.findOne({
            title,
            company,
            location,
            jobType,
            industry,
            experienceLevel,
            description,
            responsibilities,
            qualifications,
            salaryRange,
            applicationDeadline,
        });
        if (duplicateJob) {
            return res.status(409).json({
                success: false,
                data: null,
                message: "Job is already posted like this for this company.",
            });
        }
        const job = await Job_1.default.create({
            title,
            company,
            location,
            jobType,
            industry,
            experienceLevel,
            description,
            responsibilities,
            qualifications,
            salaryRange,
            applicationDeadline,
        });
        // Respond in a format compatible with TanStack Table (single object, with success and error info)
        res.status(201).json({
            success: true,
            data: job,
            message: "Job created successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.createJob = createJob;
// GET ALL JOBS
const getJobs = async (_req, res) => {
    try {
        const jobs = await Job_1.default.find().populate("company");
        // Respond in a format compatible with TanStack Table (array of jobs, with success and error info)
        res.status(200).json({
            success: true,
            data: jobs,
            message: "Jobs fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, data: null, message: "Server error" });
    }
};
exports.getJobs = getJobs;
// GET JOB BY ID
const getJobById = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job_1.default.findById(req.params.id).populate('company', 'name logoUrl');
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        // Parse salary range (assume stored as string like "100000-200000")
        let minSalary = null, maxSalary = null;
        if (job.salaryRange && typeof job.salaryRange === 'string') {
            const match = job.salaryRange.match(/(\d+)/g);
            if (match && match.length >= 2) {
                minSalary = Number(match[0]);
                maxSalary = Number(match[1]);
            }
        }
        let companyInfo = null;
        if (job.company &&
            typeof job.company === 'object' &&
            'name' in job.company &&
            'logoUrl' in job.company) {
            companyInfo = {
                id: job.company._id,
                name: job.company.name,
                logoUrl: job.company.logoUrl,
            };
        }
        else if (job.company) {
            companyInfo = { id: job.company };
        }
        res.status(200).json({
            id: job._id,
            title: job.title,
            company: companyInfo,
            location: job.location,
            jobType: job.jobType,
            postedDate: job.postedDate,
            industry: job.industry,
            experienceLevel: job.experienceLevel,
            description: job.description,
            responsibilities: job.responsibilities,
            qualifications: job.qualifications,
            salaryRange: {
                min: minSalary,
                max: maxSalary,
            },
            closingDate: job.applicationDeadline,
            postedBy: companyInfo ? companyInfo.id : null,
            status: job.status,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getJobById = getJobById;
// UPDATE JOB
const updateJob = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json(job);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateJob = updateJob;
// DELETE JOB
const deleteJob = async (req, res) => {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid job ID" });
        }
        const job = await Job_1.default.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteJob = deleteJob;
// GET /api/jobs/search?keyword=Frontend Developer
const searchJobs = async (req, res) => {
    try {
        const { query, location, industry, jobType, experienceLevel, salaryMin, salaryMax, page = 1, limit = 20, sortBy = 'recent', } = req.query;
        const filter = { status: 'Active' };
        if (query && typeof query === 'string') {
            const regex = new RegExp(query, 'i');
            filter.$or = [
                { title: regex },
                { description: regex },
                { responsibilities: regex },
                { qualifications: regex },
            ];
        }
        if (location && typeof location === 'string')
            filter.location = location;
        if (industry && typeof industry === 'string')
            filter.industry = industry;
        if (jobType && typeof jobType === 'string')
            filter.jobType = jobType;
        if (experienceLevel && typeof experienceLevel === 'string')
            filter.experienceLevel = experienceLevel;
        // Salary range: expects salaryRange as string "min-max"
        if (salaryMin || salaryMax) {
            filter.salaryRange = { $exists: true, $ne: null };
        }
        // Sorting
        let sort = { postedDate: -1 };
        if (sortBy === 'oldest')
            sort = { postedDate: 1 };
        // Pagination
        const pageNum = Number(page) || 1;
        const pageSize = Number(limit) || 20;
        const skip = (pageNum - 1) * pageSize;
        // Query
        const total = await Job_1.default.countDocuments(filter);
        let jobs = await Job_1.default.find(filter)
            .populate('company', 'name logoUrl')
            .sort(sort)
            .skip(skip)
            .limit(pageSize);
        // Filter by salaryMin and salaryMax if present
        if (salaryMin || salaryMax) {
            jobs = jobs.filter((job) => {
                if (!job.salaryRange || typeof job.salaryRange !== 'string')
                    return false;
                const match = job.salaryRange.match(/(\d+)/g);
                if (!match || match.length < 2)
                    return false;
                const min = Number(match[0]);
                const max = Number(match[1]);
                if (salaryMin && min < Number(salaryMin))
                    return false;
                if (salaryMax && max > Number(salaryMax))
                    return false;
                return true;
            });
        }
        // Format response
        const jobSummaries = jobs.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.company ? {
                id: job.company._id,
                name: job.company.name,
                logoUrl: job.company.logoUrl,
            } : null,
            location: job.location,
            jobType: job.jobType,
            postedDate: job.postedDate,
            industry: job.industry,
            experienceLevel: job.experienceLevel,
            status: job.status,
            salaryRange: job.salaryRange,
        }));
        res.status(200).json({
            jobs: jobSummaries,
            total,
            page: pageNum,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    }
    catch (error) {
        console.error('Job search error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.searchJobs = searchJobs;
// APPLY TO JOB
const applyToJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const applicantId = req.body.applicantId; // Should come from auth in real app
        let coverLetterFile, cvFile;
        if (req.files && !Array.isArray(req.files)) {
            const files = req.files;
            cvFile = files['cv']?.[0];
            coverLetterFile = files['coverLetter']?.[0];
        }
        if (!applicantId) {
            return res.status(401).json({ message: 'Unauthorized: applicantId required' });
        }
        if (!cvFile) {
            return res.status(400).json({ message: 'CV file is required' });
        }
        // Prevent duplicate application
        const existing = await Application_1.default.findOne({ job: jobId, applicant: applicantId });
        if (existing) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }
        // Store application
        const application = new Application_1.default({
            job: jobId,
            applicant: applicantId,
            cvFilePath: cvFile.path,
            coverLetterPath: coverLetterFile ? coverLetterFile.path : undefined,
            appliedAt: new Date(),
            status: 'Pending',
        });
        await application.save();
        res.status(201).json({ success: true, application });
    }
    catch (err) {
        console.error('Apply to job error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.applyToJob = applyToJob;
// GET RELATED JOBS
const getRelatedJobs = async (req, res) => {
    // TODO: Implement logic to find related jobs (e.g., by title, industry, location, etc.)
    res.status(501).json({ message: 'Get related jobs not implemented' });
};
exports.getRelatedJobs = getRelatedJobs;
