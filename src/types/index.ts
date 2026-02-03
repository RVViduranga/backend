/**
 * Global TypeScript Type Definitions
 * Shared utility types and API types used across multiple domains
 * 
 * NOTE: Core domain models are defined in @/models/ and re-exported here for backward compatibility.
 * This file should only contain:
 * - Global utility types (e.g., ApiResponse<T>, PaginatedResponse<T>)
 * - API request/response types that span multiple domains
 * - Generic types used across the application
 */

// ============================================================================
// GLOBAL UTILITY TYPES
// ============================================================================

/**
 * Generic API Error structure
 */
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

/**
 * Generic Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Job Search API Request Parameters
 */
export interface JobSearchParams {
  query?: string;
  location?: string[];
  industry?: string[];
  experienceLevel?: string[];
  jobType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'relevant';
}

/**
 * Job Search API Response
 */
export interface JobSearchResponse {
  jobs: import('@/models/job').JobSummaryModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Job Application Form Data (API Request)
 */
export interface JobApplicationData {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile: File;
  location?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
}

/**
 * Job Application API Response
 */
export interface JobApplicationResponse {
  applicationId: string;
  message: string;
  status: 'success' | 'error';
}

// ============================================================================
// AUTH SERVICE TYPES
// ============================================================================

/**
 * User Role Type
 */
export type UserRole = 'user' | 'company';

/**
 * User Type (alias for UserRole)
 */
export type UserType = 'user' | 'company';

/**
 * Authentication User (Service Response)
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  userType: UserRole;
  avatarUrl?: string;
}

/**
 * Login Credentials (Service Request)
 */
export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}

/**
 * Registration Data (Service Request)
 */
export interface RegisterData {
  email: string;
  password: string;
  userType: UserType;
  name?: string;
}

/**
 * Authentication Response (Service Response)
 */
export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken?: string;
}

// ============================================================================
// NAVIGATION UTILITY TYPES
// ============================================================================

/**
 * Navigation Link with Description (Extended utility type)
 */
export interface NavigationLinkWithDescription {
  title: string;
  iconName: string;
  url: string;
  description: string;
}

// ============================================================================
// PORTFOLIO UTILITY TYPE
// ============================================================================

/**
 * Portfolio Item (Service/API type - may differ from model)
 */
export interface PortfolioItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

// ============================================================================
// RE-EXPORTS FROM MODELS (Backward Compatibility)
// ============================================================================

// User Domain
export type {
  EducationModel as Education,
  ExperienceModel as Experience,
  MediaFileModel as MediaFile,
  UserProfileModel as UserProfile,
  CVModel as UserCV,
  DashboardStatModel as DashboardStat,
  ApplicantPersonalDetails,
  JobApplicationFormModel as JobApplicationForm,
} from '@/models/user-profile';

export type {
  UserApplicationModel as UserApplication,
  UserApplicationStatus,
} from '@/models/user-applications';

// Company Domain
export type {
  CompanySmallModel as CompanySmall,
  CompanyBrandingModel as CompanyBranding,
  CompanySummaryModel as CompanySummary,
  CompanyDetailModel as CompanyDetail,
} from '@/models/company';

// Job Domain
export type {
  JobStatus,
  JobSummaryModel as JobSummary,
  JobDetailModel as JobDetail,
  JobSearchHeroModel as JobSearchHero,
} from '@/models/job';

export type {
  JobPostInputModel as JobPostInput,
} from '@/models/job-data-forms';

// Application Domain
export type {
  ApplicationStatus,
  ApplicationModel as Application,
} from '@/models/application';

// Site/Auth Domain
export type {
  NavigationLinkModel as NavigationLink,
  SiteBrandingModel as SiteBranding,
} from '@/models/site-data';

export type {
  AuthPageVisuals,
  CompanyRegistrationModel as CompanyRegistration,
  UserSignupModel as UserSignup,
} from '@/models/auth-data';
