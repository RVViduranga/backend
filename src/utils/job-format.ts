/**
 * Job Formatting Utilities
 * Helper functions for formatting job-related data for display
 */

import type { SalaryRangeModel } from "@/models/job";
import { formatSalaryRange } from "@/lib/transformers/job-transformers";

/**
 * Format salary range for display
 * Handles both string (legacy) and object (backend-aligned) formats
 */
export function formatSalaryRangeDisplay(
  salaryRange: string | SalaryRangeModel | undefined,
  currency: string = "Rs."
): string {
  if (!salaryRange) {
    return "Not specified";
  }

  // If already a formatted string, return as-is
  if (typeof salaryRange === "string") {
    return salaryRange;
  }

  // If object, format it
  return formatSalaryRange(salaryRange, currency);
}

/**
 * Get closing date from job (handles both field names)
 */
export function getJobClosingDate(job: {
  closingDate?: string;
  applicationDeadline?: string;
}): string | undefined {
  return job.closingDate || job.applicationDeadline;
}

/**
 * Format closing date for display
 */
export function formatClosingDate(
  job: {
    closingDate?: string;
    applicationDeadline?: string;
  },
  formatFn: (date: string) => string
): string {
  const date = getJobClosingDate(job);
  return date ? formatFn(date) : "Not specified";
}
