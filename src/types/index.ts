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
// NOTE: Service-specific API types (e.g., JobSearchParams, JobSearchResponse)
// are defined in their respective service files (e.g., @/services/job.ts)
// and should be imported directly from there.
//
// This section only contains types that span multiple domains or are
// truly global utilities.

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
} from '@/models/profiles';

export type {
  UserApplicationModel as UserApplication,
  UserApplicationStatus,
  ApplicationStatus,
  ApplicationModel as Application,
} from '@/models/applications';

export type {
  SavedJobModel as SavedJob,
  SavedJobInputModel as SavedJobInput,
} from '@/models/savedJobs';

// Company Domain
export type {
  CompanySmallModel as CompanySmall,
  CompanyBrandingModel as CompanyBranding,
  CompanySummaryModel as CompanySummary,
  CompanyDetailModel as CompanyDetail,
} from '@/models/companies';

// Job Domain
export type {
  JobStatus,
  JobSummaryModel as JobSummary,
  JobDetailModel as JobDetail,
  JobSearchHeroModel as JobSearchHero,
  JobPostInputModel as JobPostInput,
} from '@/models/jobPosts';

// Site/Auth Domain
export type {
  NavigationLinkModel as NavigationLink,
  SiteBrandingModel as SiteBranding,
} from '@/models/site-data';

export type {
  AuthPageVisuals,
  CompanyRegistrationModel as CompanyRegistration,
  UserSignupModel as UserSignup,
} from '@/models/auth';
