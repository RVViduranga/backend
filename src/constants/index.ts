/**
 * Constants Index
 * Centralized export of all application constants
 */

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Jobs
  JOBS: "/jobs",
  JOB_BY_ID: (id: string) => `/jobs/${id}`,
  JOB_SEARCH: "/jobs/search",
  JOB_APPLY: (id: string) => `/jobs/${id}/apply`,
  JOB_SAVE: (id: string) => `/jobs/${id}/save`,
  JOB_UNSAVE: (id: string) => `/jobs/${id}/unsave`,

  // Companies
  COMPANIES: "/companies",
  COMPANY_BY_ID: (id: string) => `/companies/${id}`,
  COMPANY_PROFILE: "/companies/profile",
  COMPANY_JOBS: "/companies/jobs",
  COMPANY_JOB_BY_ID: (id: string) => `/companies/jobs/${id}`,
  COMPANY_JOB_APPLICATIONS: (id: string) => `/companies/jobs/${id}/applications`,
  COMPANY_APPLICATIONS: "/companies/applications",

  // Users
  USERS: "/users",
  USER_PROFILE: "/users/profile",
  USER_PROFILE_DETAILS: "/users/profile/details",
  USER_SAVED_JOBS: "/users/saved-jobs",
  USER_APPLICATIONS: "/users/applications",
  USER_APPLICATION_BY_ID: (id: string) => `/users/applications/${id}`,

  // CV Management
  USER_CV: "/users/cv",
  USER_CV_BY_ID: (id: string) => `/users/cv/${id}`,
  USER_CV_UPLOAD: "/users/cv/upload",
  USER_CV_PRIMARY: (id: string) => `/users/cv/${id}/primary`,

  // Portfolio
  USER_PORTFOLIO: "/users/portfolio",
  USER_PORTFOLIO_BY_ID: (id: string) => `/users/portfolio/${id}`,
  USER_PORTFOLIO_UPLOAD: "/users/portfolio/upload",

  // Applications
  APPLICATIONS: "/applications",
  APPLICATION_BY_ID: (id: string) => `/applications/${id}`,

  // Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_REGISTER_USER: "/auth/register/user",
  AUTH_REGISTER_COMPANY: "/auth/register/company",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_GOOGLE: "/auth/google",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_CHANGE_PASSWORD: "/auth/change-password",
  AUTH_DELETE_ACCOUNT: "/auth/account",

  // Analytics & Statistics
  ANALYTICS_PLATFORM_STATS: "/analytics/platform-stats",
  ANALYTICS_NEWSLETTER_SUBSCRIBE: "/analytics/newsletter/subscribe",
  CONTACT: "/contact",
} as const;

// Re-export from other constant files
export * from './app';
export * from './routes';
export * from './roles';
export * from './status';
export * from './messages';
export * from './job-forms';
export * from './navigation';
export * from './footer';
export * from './content';
export * from './pricing';