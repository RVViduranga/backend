/**
 * Experience Collection Model - Backend-Aligned
 * 
 * This model aligns with the backend `experience` collection schema.
 * Maps to: experience collection
 */

// ============================================================================
// EXPERIENCE MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Experience Model (Backend Schema Alignment)
 * Maps to backend `experience` collection
 */
export interface ExperienceModel {
  id?: string; // _id from backend (ObjectId) - optional for UI forms
  user?: string; // Reference to User ID (ObjectId) - optional for UI forms
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}
