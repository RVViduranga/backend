import express from 'express';
import mongoose from 'mongoose';
import SavedJob from '../models/SavedJob';
import auth from '../middleware/auth';

const router = express.Router();

// Save a job
router.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID' });
    }
    const savedJob = await SavedJob.create({
      user: (req as any).user._id,
      job: jobId,
    });
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all saved jobs for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: (req as any).user._id }).populate('job');
    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Remove a saved job
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SavedJob.findOneAndDelete({ _id: id, user: (req as any).user._id });
    if (!deleted) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    res.json({ message: 'Saved job removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
