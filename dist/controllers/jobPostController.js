"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobs = exports.deleteJob = exports.updateJob = exports.createJob = void 0;
const paginationService_1 = require("../services/paginationService");
const JobPost_1 = __importDefault(require("../models/JobPost"));
const createJob = async (req, res, next) => {
    try {
        // You may need to adjust this to match your JobPost model fields
        const { job, postedBy } = req.body;
        if (!job || !postedBy) {
            return res.sendError('job and postedBy are required', 400);
        }
        const jobPost = new JobPost_1.default({ job, postedBy });
        await jobPost.save();
        res.sendSuccess(jobPost, 'Job post created');
    }
    catch (err) {
        next(err);
    }
};
exports.createJob = createJob;
const updateJob = (req, res, next) => {
    // TODO: Implement update job logic
    res.sendSuccess(null, 'updateJob not implemented');
};
exports.updateJob = updateJob;
const deleteJob = (req, res, next) => {
    // TODO: Implement delete job logic
    res.sendSuccess(null, 'deleteJob not implemented');
};
exports.deleteJob = deleteJob;
const getJobs = async (req, res, next) => {
    try {
        const result = await (0, paginationService_1.getPaginatedData)(JobPost_1.default, req.query);
        res.sendSuccess(result, 'Job posts fetched');
    }
    catch (err) {
        next(err);
    }
};
exports.getJobs = getJobs;
