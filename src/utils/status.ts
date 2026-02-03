/**
 * Status Utility Functions
 * Helper functions for status display and formatting
 */

import type { ApplicationStatus, JobStatus } from "@/constants/status";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_COLORS,
  JOB_STATUS_COLORS,
} from "@/constants/status";

/**
 * Get CSS class for application status badge color
 */
export function getApplicationStatusColorClass(
  status: ApplicationStatus
): string {
  const color = APPLICATION_STATUS_COLORS[status];
  return `bg-${color}-100 text-${color}-800`;
}

/**
 * Get icon name for application status
 */
export function getApplicationStatusIcon(status: ApplicationStatus): string {
  switch (status) {
    case APPLICATION_STATUS.ACCEPTED:
      return "CheckCircle";
    case APPLICATION_STATUS.INTERVIEW:
      return "Calendar";
    case APPLICATION_STATUS.SHORTLISTED:
      return "Star";
    case APPLICATION_STATUS.REVIEWING:
      return "Clock";
    case APPLICATION_STATUS.PENDING:
      return "Circle";
    case APPLICATION_STATUS.REJECTED:
      return "XCircle";
    default:
      return "Circle";
  }
}

/**
 * Get CSS class for job status badge color
 */
export function getJobStatusColorClass(status: JobStatus): string {
  const color = JOB_STATUS_COLORS[status];
  return `bg-${color}-100 text-${color}-800`;
}
