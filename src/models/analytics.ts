/**
 * Analytics Model - Type Definitions
 * 
 * This model contains types for analytics and platform statistics.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Platform Statistics Interface
 * Data structure for public platform statistics (marketing/trust indicators)
 */
export interface PlatformStatistics {
  activeJobs: number | string;
  companies: number | string;
  jobSeekers: number | string;
  newJobsDaily: number | string;
}

/**
 * Contact Message Data Interface
 * Used when sending contact messages from the public contact form
 * Maps to backend `contactMessages` collection
 */
export interface ContactMessageData {
  id?: string; // _id from backend (ObjectId)
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}
