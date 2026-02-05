/**
 * Job Formatting Utilities
 * Helper functions for formatting job-related data for display
 */

import type { SalaryRangeModel } from "@/models/jobPosts";
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
 * Get application deadline from job (backend field name)
 */
export function getJobClosingDate(job: {
  applicationDeadline?: string;
  closingDate?: string; // Legacy support
}): string | undefined {
  return job.applicationDeadline || job.closingDate; // ✅ Prefer backend field name
}

/**
 * Format application deadline for display
 */
export function formatClosingDate(
  job: {
    applicationDeadline?: string;
    closingDate?: string; // Legacy support
  },
  formatFn: (date: string) => string
): string {
  const date = getJobClosingDate(job);
  return date ? formatFn(date) : "Not specified";
}
