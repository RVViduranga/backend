/**
 * Job Post Form Storage Utility
 * Handles temporary form data storage during multi-step job posting workflow
 * Uses sessionStorage for temporary form state between steps
 */
import type { JobPostInputModel } from '@/models/job-data-forms';

const STORAGE_KEYS = {
  JOB_POST_FORM_DATA: 'jobPostFormData',
  JOB_POST_ID: 'jobPostId',
} as const;

/**
 * Get job post form data from session storage
 */
export function getJobPostFormData(): JobPostInputModel | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEYS.JOB_POST_FORM_DATA);
    if (!stored) return null;
    return JSON.parse(stored) as JobPostInputModel;
  } catch {
    return null;
  }
}

/**
 * Save job post form data to session storage
 */
export function saveJobPostFormData(data: JobPostInputModel): void {
  sessionStorage.setItem(STORAGE_KEYS.JOB_POST_FORM_DATA, JSON.stringify(data));
}

/**
 * Get job post ID from session storage
 */
export function getJobPostId(): string | null {
  return sessionStorage.getItem(STORAGE_KEYS.JOB_POST_ID);
}

/**
 * Save job post ID to session storage
 */
export function saveJobPostId(id: string): void {
  sessionStorage.setItem(STORAGE_KEYS.JOB_POST_ID, id);
}

/**
 * Clear all job post form data from session storage
 */
export function clearJobPostData(): void {
  sessionStorage.removeItem(STORAGE_KEYS.JOB_POST_FORM_DATA);
  sessionStorage.removeItem(STORAGE_KEYS.JOB_POST_ID);
}


