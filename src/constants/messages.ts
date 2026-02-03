/**
 * User-facing Messages
 * Centralized error messages, success messages, and UI text
 */

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  JOB_SAVED: 'Job saved successfully',
  JOB_UNSAVED: 'Job removed from saved list',
  JOB_APPLIED: 'Application submitted successfully',
  JOB_POSTED: 'Job posted successfully',
  CV_UPLOADED: 'CV uploaded successfully',
  CV_DELETED: 'CV deleted successfully',
  CV_SET_PRIMARY: 'CV set as primary',
  PORTFOLIO_UPLOADED: 'Portfolio item uploaded successfully',
  PORTFOLIO_DELETED: 'Portfolio item deleted successfully',
  PHOTO_UPLOADED: 'Profile photo uploaded successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTRATION_SUCCESS: 'Account created successfully',
  PASSWORD_RESET_SENT: 'Password reset email sent',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Auth Errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  WEAK_PASSWORD: 'Password is too weak',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  TOKEN_INVALID: 'Invalid session. Please login again',
  
  // Profile Errors
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  PROFILE_LOAD_FAILED: 'Failed to load profile',
  
  // Job Errors
  JOB_LOAD_FAILED: 'Failed to load job details',
  JOB_SAVE_FAILED: 'Failed to save job',
  JOB_APPLY_FAILED: 'Failed to submit application',
  JOB_POST_FAILED: 'Failed to post job',
  JOB_UPDATE_FAILED: 'Failed to update job',
  JOB_DELETE_FAILED: 'Failed to delete job',
  
  // File Upload Errors
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',
  CV_UPLOAD_FAILED: 'Failed to upload CV',
  PORTFOLIO_UPLOAD_FAILED: 'Failed to upload portfolio item',
  PHOTO_UPLOAD_FAILED: 'Failed to upload photo',
  
  // Form Errors
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max: number) => `Maximum ${max} characters allowed`,
} as const;

// Info Messages
export const INFO_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  UPLOADING: 'Uploading...',
  PROCESSING: 'Processing...',
  NO_DATA: 'No data available',
  NO_JOBS: 'No jobs found',
  NO_APPLICATIONS: 'No applications found',
  NO_SAVED_JOBS: 'No saved jobs',
  NO_COMPANIES: 'No companies found',
  SEARCHING: 'Searching...',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  URL: 'Please enter a valid URL',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  MIN_VALUE: (min: number) => `Must be at least ${min}`,
  MAX_VALUE: (max: number) => `Must be no more than ${max}`,
  PASSWORD_MATCH: 'Passwords must match',
  PASSWORD_STRENGTH: 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers',
} as const;






