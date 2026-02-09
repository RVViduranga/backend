"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const SavedJob_1 = __importDefault(require("../models/SavedJob"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// Save a job
router.post('/', auth_1.default, async (req, res) => {
    try {
        const { jobId } = req.body;
        if (!jobId || !mongoose_1.default.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: 'Invalid job ID' });
        }
        const savedJob = await SavedJob_1.default.create({
            user: req.user._id,
            job: jobId,
        });
        res.status(201).json(savedJob);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Get all saved jobs for the authenticated user
router.get('/', auth_1.default, async (req, res) => {
    try {
        const savedJobs = await SavedJob_1.default.find({ user: req.user._id }).populate('job');
        res.json(savedJobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// Remove a saved job
router.delete('/:id', auth_1.default, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await SavedJob_1.default.findOneAndDelete({ _id: id, user: req.user._id });
        if (!deleted) {
            return res.status(404).json({ message: 'Saved job not found' });
        }
        res.json({ message: 'Saved job removed' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
