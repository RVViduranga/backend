/**
 * MatchingData Collection Model - Backend-Aligned
 * 
 * This model aligns with the backend `matchingData` collection schema.
 * Used for job matching algorithms and scoring.
 * Maps to: matchingData collection
 * 
 * NOTE: This model is currently not actively used in the codebase but is planned
 * for future job matching functionality.
 * 
 * TODO: Implement matching service when job matching feature is developed.
 */

// ============================================================================
// MATCHING DATA MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Matching Data Model (Backend Schema Alignment)
 * Maps to backend `matchingData` collection exactly
 * 
 * BACKEND SCHEMA (backend/src/models/MatchingData.ts):
 * - user: ObjectId (required, ref: User)
 * - job: ObjectId (required, ref: Job) - NOT "jobPost"
 * - score: number (required) - Single score, NOT multiple scores
 */
export interface MatchingDataModel {
  id: string; // _id from backend (ObjectId)
  user: string; // ✅ Reference to User ID (ObjectId)
  job: string; // ✅ Backend uses "job" not "jobPost" - Reference to Job ID (ObjectId)
  score: number; // ✅ Backend uses single "score" field, NOT skillScore/experienceScore/etc.
  // NOTE: No createdAt/updatedAt - MatchingData model doesn't have timestamps
}

/**
 * Matching Data Input Model
 * Used when creating/updating matching data
 */
export interface MatchingDataInputModel {
  user: string;
  job: string; // ✅ Backend uses "job" not "jobPost"
  score: number; // ✅ Backend uses single score
}
