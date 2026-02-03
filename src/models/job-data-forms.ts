/**
 * Job Post Form Data - Type Definitions
 *
 * NOTE: Static configuration arrays (JOB_TYPE_OPTIONS, EXPERIENCE_LEVEL_OPTIONS, LOCATION_OPTIONS)
 * have been moved to @/constants/job-forms.ts
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
