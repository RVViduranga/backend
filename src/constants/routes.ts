/**
 * Application Routes
 * Centralized route definitions for navigation
 */

export const ROUTES = {
  // Public Routes
  HOME: '/',
  SEARCH: '/search',
  JOBS: '/jobs',
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
  JOB_APPLY: (id: string) => `/jobs/${id}/apply`,
  COMPANIES: '/companies',
  COMPANY_DETAILS: (id: string) => `/companies/${id}`,
  ABOUT: '/about',
  RESOURCES: '/resources',
  HELP: '/help',
  CONTACT: '/contact',
  PRIVACY: '/privacy',
  TERMS: '/terms',

  // Auth Routes
  LOGIN_OPTIONS: '/login-options',
  USER_LOGIN: '/user/login',
  COMPANY_LOGIN: '/company/login',
  EMAIL_LOGIN: '/email-login',
  GOOGLE_LOGIN: '/google-login',
  SIGNUP: '/signup',
  SIGNUP_OPTIONS: '/signup', // Legacy - redirects to /signup
  USER_SIGNUP: '/user/signup',
  COMPANY_SIGNUP: '/company/signup',
  EMAIL_SIGNUP: '/email-signup',
  GOOGLE_SIGNUP: '/google-signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // User Routes
  USER_DASHBOARD: '/dashboard',
  USER_PROFILE_SETUP: '/profile/setup',
  USER_PROFILE_MANAGE: '/profile/manage',
  USER_PROFILE_EDIT_DETAILS: '/profile/edit-details',
  USER_PROFILE_CONTACT: '/profile/edit-details/contact',
  USER_PROFILE_EXPERIENCE: '/profile/edit-details/experience',
  USER_CV_MANAGE: '/profile/cv-manage',
  USER_CV_UPLOAD: '/profile/cv-upload',
  USER_MEDIA_MANAGE: '/profile/media-manage',
  USER_MEDIA_UPLOAD: '/profile/media-upload',
  USER_PHOTO_UPLOAD: '/profile/photo-upload',
  USER_APPLICATIONS: '/dashboard/applications',
  USER_SAVED_JOBS: '/dashboard/saved-jobs',
  USER_SETTINGS: '/settings',

  // Company Routes
  COMPANY_DASHBOARD: '/company-dashboard',
  COMPANY_PROFILE_EDIT: '/company/profile/edit',
  COMPANY_SETTINGS: '/company/settings',
  COMPANY_POST_JOB: '/job-post',
  COMPANY_JOB_REVIEW: '/job-post-review',
  COMPANY_JOB_CONFIRMATION: '/job-post-confirmation',
  COMPANY_MANAGE_JOBS: '/company/jobs',
  COMPANY_APPLICATIONS: '/company/applications',
} as const;





