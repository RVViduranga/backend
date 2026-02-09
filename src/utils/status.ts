/**
 * Status Utility Functions
 * Helper functions for status display and formatting
 */

import type { ApplicationStatus, JobStatus } from "@/constants/status";
import type { ApplicationStatus as BackendApplicationStatus } from "@/models/applications";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_COLORS,
  JOB_STATUS_COLORS,
} from "@/constants/status";

/**
 * Map backend ApplicationStatus to frontend ApplicationStatus
 * Backend: "Pending" | "Reviewed" | "Accepted" | "Rejected"
 * Frontend: "pending" | "reviewing" | "shortlisted" | "interview" | "accepted" | "rejected"
 */
export function mapBackendToFrontendStatus(
  status: BackendApplicationStatus
): ApplicationStatus {
  switch (status) {
    case "Pending":
      return APPLICATION_STATUS.PENDING;
    case "Reviewed":
      return APPLICATION_STATUS.REVIEWING; // "Reviewed" maps to "reviewing"
    case "Accepted":
      return APPLICATION_STATUS.ACCEPTED;
    case "Rejected":
      return APPLICATION_STATUS.REJECTED;
    default:
      return APPLICATION_STATUS.PENDING;
  }
}

/**
 * Map frontend ApplicationStatus to backend ApplicationStatus
 * Frontend: "pending" | "reviewing" | "shortlisted" | "interview" | "accepted" | "rejected"
 * Backend: "Pending" | "Reviewed" | "Accepted" | "Rejected"
 */
export function mapFrontendToBackendStatus(
  status: ApplicationStatus
): BackendApplicationStatus {
  switch (status) {
    case APPLICATION_STATUS.PENDING:
      return "Pending";
    case APPLICATION_STATUS.REVIEWING:
    case APPLICATION_STATUS.SHORTLISTED:
    case APPLICATION_STATUS.INTERVIEW:
      return "Reviewed"; // All review stages map to "Reviewed"
    case APPLICATION_STATUS.ACCEPTED:
      return "Accepted";
    case APPLICATION_STATUS.REJECTED:
      return "Rejected";
    default:
      return "Pending";
  }
}

/**
 * Get CSS class for application status badge color
 * Accepts both frontend and backend ApplicationStatus types
 */
export function getApplicationStatusColorClass(
  status: ApplicationStatus | BackendApplicationStatus
): string {
  // Map backend status to frontend if needed
  const frontendStatus: ApplicationStatus =
    status === "Pending" || status === "Reviewed" || status === "Accepted" || status === "Rejected"
      ? mapBackendToFrontendStatus(status as BackendApplicationStatus)
      : (status as ApplicationStatus);
  
  const color = APPLICATION_STATUS_COLORS[frontendStatus];
  return `bg-${color}-100 text-${color}-800`;
}

/**
 * Get icon name for application status
 * Accepts both frontend and backend ApplicationStatus types
 */
export function getApplicationStatusIcon(
  status: ApplicationStatus | BackendApplicationStatus
): string {
  // Map backend status to frontend if needed
  const frontendStatus: ApplicationStatus =
    status === "Pending" || status === "Reviewed" || status === "Accepted" || status === "Rejected"
      ? mapBackendToFrontendStatus(status as BackendApplicationStatus)
      : (status as ApplicationStatus);
  
  switch (frontendStatus) {
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
