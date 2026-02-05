/**
 * Applications Collection Model - Backend-Aligned & UI Convenience
 * 
 * This model aligns with the backend `applications` collection schema.
 * Maps to: applications collection
 */

import type { JobSummaryModel } from "./jobPosts";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Application Status Type
 * Matches backend Application model status enum exactly
 * 
 * BACKEND SCHEMA (backend/src/models/Application.ts):
 * status: "Pending" | "Reviewed" | "Accepted" | "Rejected"
 */
export type ApplicationStatus =
  | "Pending"    // ✅ Backend enum value (capitalized)
  | "Reviewed"   // ✅ Backend enum value
  | "Accepted"   // ✅ Backend enum value
  | "Rejected";  // ✅ Backend enum value

// ============================================================================
// APPLICATION MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Application Model (Backend Schema Alignment)
 * Maps to backend `applications` collection exactly
 * 
 * BACKEND SCHEMA (backend/src/models/Application.ts):
 * - job: ObjectId (required, ref: Job) - NOT "jobPost"
 * - applicant: ObjectId (required, ref: User) - NOT "user"
 * - cvFilePath: string (required) - NOT "cvUrl"
 * - appliedAt: Date (default: Date.now) - NOT "date"
 * - status: "Pending" | "Reviewed" | "Accepted" | "Rejected" (default: "Pending")
 * 
 * NOTE: Application model has timestamps: false (no createdAt/updatedAt)
 */
export interface ApplicationModel {
  id: string; // _id from backend (ObjectId)
  job: string; // ✅ Backend uses "job" not "jobPost" - Reference to Job ID (ObjectId)
  applicant: string; // ✅ Backend uses "applicant" not "user" - Reference to User ID (ObjectId)
  cvFilePath: string; // ✅ Backend uses "cvFilePath" not "cvUrl" - Required
  appliedAt: string; // ✅ Backend uses "appliedAt" not "date" - ISO date string
  status: ApplicationStatus; // ✅ Backend enum: "Pending" | "Reviewed" | "Accepted" | "Rejected"
  // NOTE: No createdAt/updatedAt - Application model has timestamps: false
  
  // Denormalized fields for UI convenience (populated from references)
  jobTitle?: string; // Populated from job reference
  candidateName?: string; // Populated from applicant reference
  candidateEmail?: string; // Populated from applicant reference
  candidatePhone?: string; // Populated from applicant reference
  candidateLocation?: string; // Populated from applicant reference
  experienceLevel?: string; // Populated from job or applicant profile
}

// ============================================================================
// UI CONVENIENCE MODELS
// ============================================================================

/**
 * User Application Model (UI Convenience)
 * Denormalized view with embedded job data for user-facing pages
 */
export interface UserApplicationModel {
  id: string;
  jobId: string; // Maps to ApplicationModel.job
  appliedDate: string; // Maps to ApplicationModel.appliedAt
  status: ApplicationStatus; // Uses shared ApplicationStatus type
  job: JobSummaryModel; // Denormalized job data for UI convenience
}

/**
 * @deprecated Use ApplicationStatus from @/models/applications instead
 * Kept for backward compatibility
 */
export type UserApplicationStatus = ApplicationStatus;
