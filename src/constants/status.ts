/**
 * Status Constants
 * Centralized status values and labels
 */

// Job Status
export const JOB_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING_REVIEW: "Pending Review",
  CLOSED: "Closed",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  [JOB_STATUS.ACTIVE]: "Active",
  [JOB_STATUS.INACTIVE]: "Inactive",
  [JOB_STATUS.PENDING_REVIEW]: "Pending Review",
  [JOB_STATUS.CLOSED]: "Closed",
} as const;

export const JOB_STATUS_COLORS: Record<JobStatus, string> = {
  [JOB_STATUS.ACTIVE]: "green",
  [JOB_STATUS.INACTIVE]: "gray",
  [JOB_STATUS.PENDING_REVIEW]: "yellow",
  [JOB_STATUS.CLOSED]: "red",
} as const;

// Application Status
export const APPLICATION_STATUS = {
  PENDING: "pending",
  REVIEWING: "reviewing",
  SHORTLISTED: "shortlisted",
  INTERVIEW: "interview",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [APPLICATION_STATUS.PENDING]: "Pending",
  [APPLICATION_STATUS.REVIEWING]: "Under Review",
  [APPLICATION_STATUS.SHORTLISTED]: "Shortlisted",
  [APPLICATION_STATUS.INTERVIEW]: "Interview Scheduled",
  [APPLICATION_STATUS.REJECTED]: "Rejected",
  [APPLICATION_STATUS.ACCEPTED]: "Accepted",
} as const;

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [APPLICATION_STATUS.PENDING]: "gray",
  [APPLICATION_STATUS.REVIEWING]: "yellow",
  [APPLICATION_STATUS.SHORTLISTED]: "purple",
  [APPLICATION_STATUS.INTERVIEW]: "blue",
  [APPLICATION_STATUS.REJECTED]: "red",
  [APPLICATION_STATUS.ACCEPTED]: "green",
} as const;

// Job Types
export const JOB_TYPES = {
  FULL_TIME: "Full-Time",
  PART_TIME: "Part-Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
} as const;

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

// Experience Levels
export const EXPERIENCE_LEVELS = {
  ENTRY_LEVEL: "Entry Level",
  MID_LEVEL: "Mid Level",
  SENIOR_LEVEL: "Senior Level",
  EXECUTIVE: "Executive",
} as const;

export type ExperienceLevel =
  (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];

// NOTE: Status utility functions have been moved to @/utils/status.ts
// - getApplicationStatusColorClass()
// - getApplicationStatusIcon()
// - getJobStatusColorClass()
