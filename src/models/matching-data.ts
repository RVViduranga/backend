/**
 * Matching Data Model - Backend-Aligned
 * 
 * This model aligns with the backend `matchingData` collection schema.
 * Used for job matching algorithms and scoring.
 */

/**
 * Matching Data Model (Backend Schema Alignment)
 * Maps to backend `matchingData` collection
 */
export interface MatchingDataModel {
  id: string; // _id from backend (ObjectId)
  user: string; // Reference to User ID (ObjectId)
  jobPost: string; // Reference to JobPost ID (ObjectId)
  skillScore: number;
  experienceScore: number;
  qualificationScore: number;
  totalScore: number;
}

/**
 * Matching Data Input Model
 * Used when creating/updating matching data
 */
export interface MatchingDataInputModel {
  user: string;
  jobPost: string;
  skillScore: number;
  experienceScore: number;
  qualificationScore: number;
  totalScore: number;
}
