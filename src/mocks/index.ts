/**
 * Mock Data Index
 * Centralized export of all mock data
 */

export * from "./users.mock";
export * from "./jobs.mock";
export * from "./companies.mock";
export * from "./applications.mock";
export * from "./analytics.mock";
// Export user applications map for user-specific data
export { MOCK_USER_APPLICATIONS_MAP } from "./applications.mock";

// Alias for backward compatibility
import { MOCK_COMPANIES } from "./companies.mock";
export const MOCK_SMALL_COMPANIES = MOCK_COMPANIES;
