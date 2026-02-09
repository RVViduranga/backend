import { getPaginatedData } from '../services/paginationService';
import JobPost from '../models/JobPost';
import { Request, Response, NextFunction } from 'express';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // You may need to adjust this to match your JobPost model fields
    const { job, postedBy } = req.body;
    if (!job || !postedBy) {
      return (res as any).sendError('job and postedBy are required', 400);
    }
    const jobPost = new JobPost({ job, postedBy });
    await jobPost.save();
    (res as any).sendSuccess(jobPost, 'Job post created');
  } catch (err) {
    next(err);
  }
};

export const updateJob = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement update job logic
  (res as any).sendSuccess(null, 'updateJob not implemented');
};

export const deleteJob = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement delete job logic
  (res as any).sendSuccess(null, 'deleteJob not implemented');
};

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPaginatedData(JobPost, req.query);
    (res as any).sendSuccess(result, 'Job posts fetched');
  } catch (err) {
    next(err);
  }
};
