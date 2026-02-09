"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getJobSeekerApplications = exports.getEmployerApplications = exports.applyJob = void 0;
const Application_1 = __importDefault(require("../models/Application"));
const Job_1 = __importDefault(require("../models/Job"));
/**
 * Apply for a job (Job seeker only, with CV upload)
 */
const applyJob = async (req, res, next) => {
    try {
        const jobId = req.params.jobId;
        const applicantId = req.user?.id;
        if (!applicantId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Prevent duplicate application
        const existing = await Application_1.default.findOne({
            job: jobId,
            applicant: applicantId,
        });
        if (existing) {
            res.status(400).json({ message: "Already applied to this job" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: "CV file is required" });
            return;
        }
        const application = new Application_1.default({
            job: jobId,
            applicant: applicantId,
            cvFilePath: req.file.path,
        });
        await application.save();
        res.status(201).json(application);
    }
    catch (err) {
        next(err);
    }
};
exports.applyJob = applyJob;
/**
 * Get applications for employer's jobs
 */
const getEmployerApplications = async (req, res, next) => {
    try {
        const employerId = req.user?.id;
        if (!employerId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const jobs = await Job_1.default.find({ employer: employerId });
        const jobIds = jobs.map((j) => j._id);
        const applications = await Application_1.default.find({
            job: { $in: jobIds },
        })
            .populate({ path: "job", select: "employer" })
            .populate("applicant", "name email");
        res.json(applications);
    }
    catch (err) {
        next(err);
    }
};
exports.getEmployerApplications = getEmployerApplications;
/**
 * Get applications for job seeker
 */
const getJobSeekerApplications = async (req, res, next) => {
    try {
        const applicantId = req.user?.id;
        if (!applicantId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const applications = await Application_1.default.find({
            applicant: applicantId,
        }).populate("job");
        res.json(applications);
    }
    catch (err) {
        next(err);
    }
};
exports.getJobSeekerApplications = getJobSeekerApplications;
/**
 * Update application status (Employer only)
 */
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const employerId = req.user?.id;
        if (!employerId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const application = await Application_1.default.findById(req.params.id).populate({ path: "job", select: "employer" });
        if (!application) {
            res.status(404).json({ message: "Application not found" });
            return;
        }
        // Type guard for populated job
        const job = application.job;
        if (!job.employer || job.employer !== employerId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        application.status = status;
        await application.save();
        res.json(application);
    }
    catch (err) {
        next(err);
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
