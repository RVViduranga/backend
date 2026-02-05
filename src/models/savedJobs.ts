/**
 * SavedJobs Collection Model - Backend-Aligned
 * 
 * This model aligns with the backend `savedJobs` collection schema.
 * Maps to: savedJobs collection
 * 
 * BACKEND SCHEMA (backend/src/models/SavedJob.ts):
 * - user: ObjectId (required, ref: User)
 * - job: ObjectId (required, ref: Job)
 * - savedAt: Date (default: Date.now)
 */

// ============================================================================
// SAVED JOB MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * SavedJob Model (Backend Schema Alignment)
 * Maps to backend `savedJobs` collection exactly
 */
export interface SavedJobModel {
  id: string; // _id from backend (ObjectId)
  user: string; // ✅ Reference to User ID (ObjectId)
  job: string; // ✅ Reference to Job ID (ObjectId)
  savedAt: string; // ✅ ISO date string (default: Date.now)
}

/**
 * SavedJob Input Model
 * Used when creating a saved job
 */
export interface SavedJobInputModel {
  jobId: string; // Job ID to save
}
