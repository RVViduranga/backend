import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";
import Job from "../models/Job";

// Extend Express Request to include user & file (from JWT + Multer)
type AuthRequest = Request & {
  user?: {
    id: string;
    role?: string;
  };
  file?: Express.Multer.File;
};

/**
 * Apply for a job (Job seeker only, with CV upload)
 */
export const applyJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jobId = req.params.jobId;
    const applicantId = req.user?.id;

    if (!applicantId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Prevent duplicate application
    const existing = await Application.findOne({
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

    const application = new Application({
      job: jobId,
      applicant: applicantId,
      cvFilePath: req.file.path,
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

/**
 * Get applications for employer's jobs
 */
export const getEmployerApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employerId = req.user?.id;

    if (!employerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const jobs = await Job.find({ employer: employerId });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({ path: "job", select: "employer" })
      .populate("applicant", "name email");

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * Get applications for job seeker
 */
export const getJobSeekerApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const applicantId = req.user?.id;

    if (!applicantId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const applications = await Application.find({
      applicant: applicantId,
    }).populate("job");

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * Update application status (Employer only)
 */
export const updateApplicationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const employerId = req.user?.id;

    if (!employerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const application = await Application.findById(req.params.id).populate({ path: "job", select: "employer" });

    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    // Type guard for populated job
    const job = application.job as { employer?: string };
    if (!job.employer || job.employer !== employerId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    next(err);
  }
};
