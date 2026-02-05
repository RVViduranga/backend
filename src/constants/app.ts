/**
 * Application-wide constants
 * Centralized configuration values
 */

// Application Info
export const APP_NAME = "JobLink Pro";
export const APP_TAGLINE = "Your destination for the next career move.";

// Site Branding
import type { SiteBrandingModel } from "@/models/site-data";
export const SITE_BRANDING: SiteBrandingModel = {
  siteName: "JobLink Pro",
  logoUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/1543e13a-c12d-468e-8333-6ca8dda67c87.png",
  mainHeroImageUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/58778458-0e25-41d6-badb-c6eee86c758a.png",
  tagline: "Your destination for the next career move.",
};

// Auth Page Visuals
import type { AuthPageVisuals } from "@/models/auth";
export const AUTH_VISUALS: AuthPageVisuals = {
  illustrationUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/ce4f7ead-d664-4cf3-941c-0eca53326e25.png",
  loginBackgroundUrl: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/c8c4fd3f-0132-45d6-b39e-77803d0f99f5.png",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// File Upload Limits
export const MAX_CV_SIZE_MB = 5;
export const MAX_PORTFOLIO_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_MB = 2;
export const ALLOWED_CV_FORMATS = ["pdf", "doc", "docx"];
export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp"];
export const ALLOWED_DOCUMENT_FORMATS = ["pdf", "doc", "docx", "txt"];

// File MIME Types
export const ALLOWED_CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

// Portfolio File Formats
export const PORTFOLIO_SUPPORTED_FORMATS = {
  documents: ["PDF", "DOCX", "PPT"] as const,
  designFiles: ["Figma", "XD", "Sketch"] as const,
  images: ["JPG", "PNG", "SVG"] as const,
} as const;

export const PORTFOLIO_ACCEPTED_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".fig",
  ".xd",
  ".sketch",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".gif",
  ".zip",
  ".rar",
] as const;

// Date Formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_DISPLAY_FORMAT = "MMM DD, YYYY";
export const DATETIME_DISPLAY_FORMAT = "MMM DD, YYYY, hh:mm A";

// Debounce/Delay Times (ms)
export const SEARCH_DEBOUNCE_MS = 300;
export const API_TIMEOUT_MS = 30000;
export const TOAST_DURATION_MS = 3000;

// Session Storage Keys
export const SESSION_KEYS = {
  JOB_POST_FORM_DATA: "jobPostFormData",
  JOB_POST_ID: "jobPostId",
  REDIRECT_AFTER_LOGIN: "redirectAfterLogin",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PROFILE: "user_profile",
  BOOKMARKED_JOBS: "bookmarked_jobs",
  COMPANY_JOBS: "companyJobs",
  COMPANY_APPLICATIONS: "companyApplications",
  USER_APPLICATIONS: "userApplications",
  SAVED_JOBS: "savedJobs",
  USER_CVS: "userCVs",
  USER_PORTFOLIO: "userPortfolio",
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_GOOGLE_AUTH: true,
  ENABLE_PORTFOLIO_UPLOAD: true,
  ENABLE_JOB_ALERTS: false,
  ENABLE_ANALYTICS: false,
} as const;

// Contact Information
export const CONTACT_METHODS = [
  {
    title: "Email",
    description: "Send us an email",
    value: "support@jobcenter.lk",
    icon: "Mail",
    href: "mailto:support@jobcenter.lk",
  },
  {
    title: "Phone",
    description: "Call us during business hours",
    value: "+94 11 234 5678",
    icon: "Phone",
    href: "tel:+94112345678",
  },
  {
    title: "Office",
    description: "Visit our office",
    value: "Colombo 05, Sri Lanka",
    icon: "MapPin",
    href: null,
  },
] as const;

// Business Hours
export const BUSINESS_HOURS = {
  weekdays: "Mon - Fri: 9:00 AM - 6:00 PM",
  saturday: "Sat: 9:00 AM - 1:00 PM",
} as const;

// Social Media Links
export const SOCIAL_LINKS = [
  { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  { icon: "Twitter", href: "https://twitter.com", label: "Twitter" },
  { icon: "Facebook", href: "https://facebook.com", label: "Facebook" },
  { icon: "Instagram", href: "https://instagram.com", label: "Instagram" },
] as const;
