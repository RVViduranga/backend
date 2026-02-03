/**
 * Job Data - Type Definitions and Static Configuration
 */

import type { CompanySmallModel } from "./company";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type JobStatus = "Active" | "Inactive" | "Pending Review" | "Closed";

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
 * Salary Range Object (Backend Schema Alignment)
 * Maps to backend `salaryRange` object structure
 */
export interface SalaryRangeModel {
  min: number;
  max: number;
}

export interface JobDetailModel extends JobSummaryModel {
  description: string;
  responsibilities: string[]; // UI convenience field (may not be in backend)
  qualifications: string[]; // UI convenience field (may not be in backend)
  salaryRange: SalaryRangeModel; // ✅ Changed from string to object (backend aligned)
  experienceLevel: string;
  closingDate: string; // ✅ Renamed from applicationDeadline (backend aligned)
  postedBy: string; // ✅ Added: Reference to User ID (ObjectId)
  status: JobStatus;
}

export interface JobSearchHeroModel {
  title: string;
  subtitle: string;
  imageUrl: string;
}

// ============================================================================
// STATIC CONFIGURATION (if needed)
// ============================================================================
