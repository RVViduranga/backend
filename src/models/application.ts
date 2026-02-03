/**
 * Application Data - Type Definitions
 */

import type { JobSummaryModel } from "./job";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "accepted";

/**
 * Application Model (Backend Schema Alignment)
 * Maps to backend `applications` collection
 */
export interface ApplicationModel {
  id: string; // _id from backend (ObjectId)
  jobPost: string; // ✅ Renamed from jobId (Reference to JobPost ID - ObjectId)
  user: string; // ✅ Added: Reference to User ID (ObjectId)
  status: ApplicationStatus;
  date: string; // ✅ Renamed from appliedDate (ISO date string)
  
  // Denormalized fields for UI convenience (populated from references)
  jobTitle?: string; // Populated from jobPost reference
  candidateName?: string; // Populated from user reference
  candidateEmail?: string; // Populated from user reference
  candidatePhone?: string; // Populated from user reference
  candidateLocation?: string; // Populated from user reference
  cvUrl?: string; // Populated from user's profile.cv
  coverLetter?: string; // May be stored separately or in application
  experienceLevel?: string; // Populated from jobPost or user profile
}

// ============================================================================
// STATIC CONFIGURATION (if needed)
// ============================================================================
