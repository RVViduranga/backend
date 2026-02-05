/**
 * Education Collection Model - Backend-Aligned
 * 
 * This model aligns with the backend `education` collection schema.
 * Maps to: education collection
 */

// ============================================================================
// EDUCATION MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Education Model (Backend Schema Alignment)
 * Maps to backend `education` collection
 */
export interface EducationModel {
  id?: string; // _id from backend (ObjectId) - optional for UI forms
  user?: string; // Reference to User ID (ObjectId) - optional for UI forms
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}
