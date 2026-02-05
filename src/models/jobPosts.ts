/**
 * JobPosts Collection Model - Backend-Aligned & UI Convenience
 * 
 * This model aligns with the backend `jobPosts` collection schema.
 * Maps to: jobPosts collection
 */

import type { CompanySmallModel } from "./companies";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type JobStatus = "Active" | "Inactive" | "Pending Review" | "Closed";

/**
 * Salary Range Model
 * NOTE: Backend stores salaryRange as STRING (e.g., "100000-200000")
 * This object is for UI convenience only - backend uses string format
 */
export interface SalaryRangeModel {
  min: number;
  max: number;
}

/**
 * Helper function to parse backend salaryRange string to object
 */
export function parseSalaryRange(salaryRange: string): SalaryRangeModel | null {
  if (!salaryRange || typeof salaryRange !== 'string') return null;
  const match = salaryRange.match(/(\d+)/g);
  if (!match || match.length < 2) return null;
  return {
    min: Number(match[0]),
    max: Number(match[1]),
  };
}

/**
 * Helper function to format salaryRange object to backend string format
 */
export function formatSalaryRange(range: SalaryRangeModel): string {
  return `${range.min}-${range.max}`;
}

// ============================================================================
// JOB POST MODELS (Backend Schema Alignment)
// ============================================================================

export interface JobSummaryModel {
  id: string;
  title: string;
  company: CompanySmallModel;
  location: string;
  jobType: string;
  postedDate: string;
  industry?: string;
  experienceLevel?: string;
  status?: JobStatus; // Company view only
  views?: number; // Company view only
  applicationsCount?: number; // Company view only
}

/**
 * Job Detail Model (Backend Schema Alignment)
 * Maps to backend `jobs` collection exactly
 * 
 * BACKEND SCHEMA (backend/src/models/Job.ts):
 * - title: string (required)
 * - company: ObjectId (required, ref: Company)
 * - location: string (required)
 * - jobType: string (required)
 * - postedDate: Date (default: Date.now)
 * - industry?: string
 * - experienceLevel?: string
 * - status?: JobStatus (default: "Active")
 * - views?: number (default: 0)
 * - applicationsCount?: number (default: 0)
 * - description: string (required)
 * - responsibilities: string[] (default: [])
 * - qualifications: string[] (default: [])
 * - salaryRange: string (required) - stored as "min-max" string
 * - applicationDeadline: string (required) - NOT "closingDate"
 * 
 * NOTE: Job model does NOT have timestamps (createdAt/updatedAt)
 * NOTE: postedBy is in JobPost collection, not Job model
 */
export interface JobDetailModel extends JobSummaryModel {
  description: string; // ✅ Required
  responsibilities: string[]; // ✅ Backend field (default: [])
  qualifications: string[]; // ✅ Backend field (default: [])
  salaryRange: string; // ✅ Backend stores as STRING "min-max", NOT object
  experienceLevel: string; // ✅ Optional in backend but required in UI
  applicationDeadline: string; // ✅ Backend uses "applicationDeadline" not "closingDate"
  status: JobStatus; // ✅ Default: "Active"
  // NOTE: No createdAt/updatedAt - Job model doesn't have timestamps
  // NOTE: No postedBy - that's in JobPost collection
}

// ============================================================================
// UI CONVENIENCE MODELS
// ============================================================================

export interface JobSearchHeroModel {
  title: string;
  subtitle: string;
  imageUrl: string;
}

// ============================================================================
// FORM MODELS
// ============================================================================

/**
 * Job Post Input Model
 * Used for job posting form inputs
 */
export interface JobPostInputModel {
  title: string;
  description: string;
  requirements: string[];
  qualifications?: string[];
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  applicationDeadline: string;
  industry?: string;
}

// NOTE: Static configuration arrays are in @/constants/job-forms.ts
