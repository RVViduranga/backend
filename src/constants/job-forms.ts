/**
 * Job Form Constants
 * Static configuration arrays for job posting forms
 *
 * These constants are used for dropdown options in job posting forms.
 * They represent valid values for job type, experience level, and location fields.
 */

/**
 * Available job type options
 */
export const JOB_TYPE_OPTIONS = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
  "Freelance",
] as const;

/**
 * Available experience level options
 */
export const EXPERIENCE_LEVEL_OPTIONS = [
  "Entry Level",
  "Mid Level",
  "Senior Level",
  "Executive",
] as const;

/**
 * Available location options
 */
export const LOCATION_OPTIONS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Jaffna",
  "Negombo",
  "Kurunegala",
  "Remote",
] as const;

/**
 * Available industry options
 */
export const INDUSTRY_OPTIONS = [
  "Information Technology",
  "Finance",
  "Marketing",
  "Manufacturing",
  "Healthcare",
] as const;

/**
 * Default job type
 */
export const DEFAULT_JOB_TYPE = "Full-Time" as const;

/**
 * Popular search terms (static)
 * TODO: Replace with API call to get trending searches from database
 * Backend endpoint: GET /jobs/popular-searches
 */
export const POPULAR_SEARCH_TERMS = [
  "Software Developer",
  "Marketing Manager",
  "Data Analyst",
  "Accountant",
  "Sales Executive",
] as const;
