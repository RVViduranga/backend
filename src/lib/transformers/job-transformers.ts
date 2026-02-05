/**
 * Job Transformers - Convert between backend models and UI models
 * 
 * Handles transformation between:
 * - Backend-aligned models (JobDetailModel with SalaryRangeModel)
 * - Legacy string-based salaryRange
 * - Mock data formats
 */

import type { JobDetailModel, SalaryRangeModel } from "@/models/jobPosts";

/**
 * Parse salary range string to SalaryRangeModel object
 * Handles formats like:
 * - "Rs. 150,000 - Rs. 250,000 per month"
 * - "$50,000 - $80,000"
 * - "150000-250000"
 */
export function parseSalaryRange(salaryRange: string | SalaryRangeModel): SalaryRangeModel {
  // If already an object, return as-is
  if (typeof salaryRange === "object" && salaryRange !== null && "min" in salaryRange && "max" in salaryRange) {
    return salaryRange;
  }

  // If string, try to parse it
  if (typeof salaryRange === "string") {
    // Remove currency symbols and text
    const cleaned = salaryRange.replace(/[Rs\.$,\s]/g, "").toLowerCase();
    
    // Try to extract numbers
    const numbers = cleaned.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const min = parseInt(numbers[0], 10);
      const max = parseInt(numbers[1], 10);
      if (!isNaN(min) && !isNaN(max)) {
        return { min, max };
      }
    }
    
    // If parsing fails, try to extract single number and use as min
    const singleNumber = cleaned.match(/\d+/);
    if (singleNumber) {
      const value = parseInt(singleNumber[0], 10);
      if (!isNaN(value)) {
        return { min: value, max: value * 1.5 }; // Estimate max as 1.5x min
      }
    }
  }

  // Default fallback
  return { min: 0, max: 0 };
}

/**
 * Format SalaryRangeModel to display string
 */
export function formatSalaryRange(salaryRange: SalaryRangeModel | string, currency: string = "Rs."): string {
  if (typeof salaryRange === "string") {
    return salaryRange; // Already formatted
  }

  if (salaryRange.min === 0 && salaryRange.max === 0) {
    return "Not specified";
  }

  if (salaryRange.min === salaryRange.max) {
    return `${currency} ${salaryRange.min.toLocaleString()}`;
  }

  return `${currency} ${salaryRange.min.toLocaleString()} - ${currency} ${salaryRange.max.toLocaleString()}`;
}

/**
 * Transform legacy JobDetailModel (with string salaryRange) to new format
 */
export function transformJobDetailToBackendFormat(job: Partial<JobDetailModel> & { salaryRange?: string | SalaryRangeModel; applicationDeadline?: string; closingDate?: string }): JobDetailModel {
  return {
    ...job,
    salaryRange: parseSalaryRange(job.salaryRange || "Not specified"),
    closingDate: job.closingDate || job.applicationDeadline || "", // Support both field names
    postedBy: job.postedBy || "", // Default empty if not provided
    status: job.status || "Active",
  } as JobDetailModel;
}

/**
 * Normalize job data from various sources (mock, localStorage, API)
 */
export function normalizeJobDetail(job: any): JobDetailModel {
  return transformJobDetailToBackendFormat({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.jobType,
    postedDate: job.postedDate,
    description: job.description || "",
    responsibilities: job.responsibilities || [],
    qualifications: job.qualifications || [],
    salaryRange: job.salaryRange,
    experienceLevel: job.experienceLevel || "",
    applicationDeadline: job.applicationDeadline,
    closingDate: job.closingDate,
    postedBy: job.postedBy,
    status: job.status,
    industry: job.industry,
    views: job.views,
    applicationsCount: job.applicationsCount,
  });
}
