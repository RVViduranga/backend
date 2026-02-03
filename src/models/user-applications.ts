/**
 * User Applications Data - Type Definitions
 */

import type { JobSummaryModel } from "./job";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type UserApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "accepted";

export interface UserApplicationModel {
  id: string;
  jobId: string;
  appliedDate: string;
  status: UserApplicationStatus;
  job: JobSummaryModel;
}

// ============================================================================
// STATIC CONFIGURATION (if needed)
// ============================================================================
