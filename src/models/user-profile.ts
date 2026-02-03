/**
 * User Profile Data - Type Definitions and Static Configuration
 * 
 * NOTE: This file contains both backend-aligned ProfileModel and UI convenience models.
 * - ProfileModel: Aligns with backend `profiles` collection
 * - UserProfileModel: Legacy model (deprecated, use UserProfileViewModel instead)
 * - UserProfileViewModel: View model combining User + Profile for UI convenience
 */

import type { JobSummaryModel } from "./job";
import { NavigationLinkModel } from "./site-data";
import type { UserModel } from "./user";
import type { MatchingDataModel } from "./matching-data";

export interface EducationModel {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ExperienceModel {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface MediaFileModel {
  id: string;
  fileName: string;
  fileType: "CV" | "Portfolio Image" | "Portfolio Document";
  uploadDate: string;
  url: string;
  sizeKB: number;
}

/**
 * Profile Model (Backend Schema Alignment)
 * Maps to backend `profiles` collection
 */
export interface ProfileModel {
  id: string; // _id from backend (ObjectId)
  user: string; // Reference to User ID (ObjectId)
  cv?: string; // File URL/Path (Upload)
  experience: number; // Years of experience
  qualification: number; // Level/Score
  skill: number; // Score
  matchingData?: string; // Reference to MatchingData ID (ObjectId)
}

/**
 * User Profile Model (Legacy - Deprecated)
 * @deprecated Use UserProfileViewModel instead for UI components
 * This model merges User + Profile data, which doesn't match backend structure.
 * Kept for backward compatibility during migration.
 */
export interface UserProfileModel {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  location: string;
  avatarUrl: string;
  cvUploaded: boolean;
  education: EducationModel[];
  experience: ExperienceModel[];
}

/**
 * User Profile View Model (UI Convenience)
 * Combines UserModel + ProfileModel for UI components
 * This is a view model that can be composed from backend data
 */
export interface UserProfileViewModel {
  // User data
  user: UserModel;
  
  // Profile data (optional, may not exist for new users)
  profile?: ProfileModel;
  
  // Computed/UI convenience fields
  fullName: string; // Computed from firstName + lastName
  displayName: string; // Computed (fullName or email)
  profileCompletion: number; // Computed percentage (0-100)
  
  // UI convenience arrays (populated from separate endpoints or computed)
  education?: EducationModel[]; // From separate endpoint or computed
  experienceHistory?: ExperienceModel[]; // From separate endpoint or computed
  
  // UI-specific fields
  headline?: string; // UI only
  avatarUrl?: string; // UI only (may come from profile or user)
  cvUploaded?: boolean; // Computed from profile.cv existence
}

// --- User Dashboard & Profile Navigation ---

export interface DashboardStatModel {
  iconName: string;
  title: string;
  value: number;
}

export interface ProfileManagementLinkModel extends NavigationLinkModel {
  description: string;
  iconName: string; // Overload iconName
}

export interface PersonalDetailsLinkModel extends NavigationLinkModel {
  description: string;
  iconName: string;
}

// NOTE: Static configuration arrays have been moved to @/constants/navigation.ts
// - DASHBOARD_STATS_STRUCTURE
// - USER_DASHBOARD_LINKS
// - PROFILE_MANAGEMENT_LINKS
// - PERSONAL_DETAILS_LINKS

// ============================================================================
// CV AND MEDIA TYPE DEFINITIONS
// ============================================================================

export interface CVModel {
  id: string;
  name: string;
  dateUploaded: string;
  isPrimary: boolean;
  sizeMB: number;
  downloadUrl: string;
}

// ============================================================================
// APPLICATION FORM TYPE DEFINITIONS
// ============================================================================

export interface ApplicantPersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  // CV/Media are handled separately
}

export interface JobApplicationFormModel extends ApplicantPersonalDetails {
  jobId: string;
  coverLetterText?: string;
  cvFileName: string; // Name of the CV used
}

// ============================================================================
// STATIC CONFIGURATION (if needed)
// ============================================================================
