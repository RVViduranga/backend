/**
 * Profiles Collection Model - Backend-Aligned & UI Convenience
 * 
 * This model aligns with the backend `profiles` collection schema.
 * Maps to: profiles collection
 */

import type { UserModel } from "./users";
import type { MatchingDataModel } from "./matchingData";
import { NavigationLinkModel } from "./site-data";
import type { EducationModel } from "./education";
import type { ExperienceModel } from "./experience";

// ============================================================================
// PROFILE MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Profile Model (Backend Schema Alignment)
 * Maps to backend `profiles` collection exactly
 * 
 * BACKEND SCHEMA (backend/src/models/Profile.ts):
 * - user: ObjectId (required, ref: User)
 * - fullName: string (required)
 * - email: string (required)
 * - phone: string (optional)
 * - headline: string (optional)
 * - location: string (optional)
 * - avatarUrl: string (optional)
 * - cvUploaded: boolean (default: false)
 * - education: EducationModel[] (embedded array)
 * - experience: ExperienceModel[] (embedded array)
 * - cvs: CVModel[] (embedded array)
 * - mediaFiles: MediaFileModel[] (embedded array - Profile Photos only)
 * - projects: ProjectModel[] (embedded array)
 */
export interface ProfileModel {
  id: string; // _id from backend (ObjectId)
  user: string; // Reference to User ID (ObjectId)
  fullName: string; // ✅ Backend field name
  email: string; // ✅ Backend field name
  phone?: string; // ✅ Backend field name
  headline?: string; // ✅ Backend field name (not "bio")
  location?: string; // ✅ Backend field name
  address?: string; // ✅ Backend field name
  city?: string; // ✅ Backend field name
  state?: string; // ✅ Backend field name
  zipCode?: string; // ✅ Backend field name
  country?: string; // ✅ Backend field name
  dateOfBirth?: string; // ✅ Backend field name
  nationality?: string; // ✅ Backend field name
  avatarUrl?: string; // ✅ Backend field name
  cvUploaded: boolean; // ✅ Backend field name (default: false)
  education: EducationModel[]; // ✅ Backend embedded array
  experience: ExperienceModel[]; // ✅ Backend embedded array
  cvs: CVModel[]; // ✅ Backend embedded array
  mediaFiles: MediaFileModel[]; // ✅ Backend embedded array (Profile Photos only)
  projects?: ProjectModel[]; // ✅ Backend embedded array
}

// ============================================================================
// UI CONVENIENCE MODELS
// ============================================================================

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
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  nationality?: string;
  avatarUrl: string;
  cvUploaded: boolean;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    description: string;
  }>;
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
  // Note: Import EducationModel and ExperienceModel from their collection files when needed
  education?: any[]; // EducationModel[] - From separate endpoint or computed
  experienceHistory?: any[]; // ExperienceModel[] - From separate endpoint or computed
  
  // UI-specific fields
  headline?: string; // UI only
  avatarUrl?: string; // UI only (may come from profile or user)
  cvUploaded?: boolean; // Computed from profile.cv existence
}

// ============================================================================
// CV AND PORTFOLIO MODELS
// ============================================================================

/**
 * CV Model (Backend Schema Alignment)
 * Embedded in Profile.cvs array
 * 
 * BACKEND SCHEMA (backend/src/models/Profile.ts):
 * - id: string
 * - fileName: string
 * - name?: string (Display name)
 * - uploadDate: string
 * - url: string
 * - sizeKB: number
 * - isPrimary?: boolean
 */
export interface CVModel {
  id: string;
  fileName: string;
  name?: string; // Display name (optional)
  uploadDate: string;
  url: string;
  sizeKB: number;
  isPrimary?: boolean; // Primary flag for CVs
}

/**
 * User CV Interface (Service Layer)
 * Used for CV upload and management operations
 * Maps to backend `cvs` collection
 */
export interface UserCV {
  id: string; // _id from backend (ObjectId)
  user?: string; // Reference to User ID (ObjectId)
  name: string;
  fileName: string;
  uploadedDate: string; // Upload timestamp (ISO date string)
  fileSize: string;
  isPrimary: boolean;
  format: string;
  downloadUrl: string;
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}

/**
 * Portfolio Item Interface (Service Layer)
 * Used for portfolio upload and management operations
 * Maps to backend `portfolio` collection
 */
export interface PortfolioItem {
  id: string; // _id from backend (ObjectId)
  user?: string; // Reference to User ID (ObjectId)
  name: string;
  type: string;
  uploadDate: string; // Upload timestamp (ISO date string)
  size: string;
  url: string;
  createdAt?: string; // Document creation timestamp (ISO date string)
  updatedAt?: string; // Document last update timestamp (ISO date string)
}

/**
 * ProjectFileModel (Backend Schema Alignment)
 * Embedded in ProjectModel.files array
 */
export interface ProjectFileModel {
  id: string;
  fileName: string;
  fileType: "Project Image" | "Project Document";
  uploadDate: string;
  url: string;
  sizeKB: number;
}

/**
 * ProjectModel (Backend Schema Alignment)
 * Embedded in Profile.projects array
 * 
 * BACKEND SCHEMA (backend/src/models/Profile.ts):
 * - id: string
 * - title: string
 * - description?: string
 * - category?: string
 * - platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload"
 * - isFeatured?: boolean
 * - projectLink?: string
 * - files: ProjectFileModel[]
 * - uploadedDate: string
 */
export interface ProjectModel {
  id: string;
  title: string;
  description?: string;
  category?: string;
  platform?: "GitHub" | "Behance" | "Dribbble" | "Personal Website" | "Other" | "File Upload";
  isFeatured?: boolean;
  projectLink?: string;
  files: ProjectFileModel[];
  uploadedDate: string;
}

/**
 * MediaFileModel (Backend Schema Alignment)
 * Embedded in Profile.mediaFiles array
 * 
 * BACKEND SCHEMA (backend/src/models/Profile.ts):
 * - id: string
 * - fileName: string
 * - name?: string (Display name, optional)
 * - fileType: "Profile Photo"
 * - uploadDate: string
 * - url: string
 * - sizeKB: number
 * - isPrimary?: boolean (for Profile Photos)
 * 
 * NOTE: CVs are now stored in the cvs array, not mediaFiles
 * NOTE: Portfolio items are stored in the projects array, not mediaFiles
 */
export interface MediaFileModel {
  id: string;
  fileName: string;
  name?: string; // Display name (optional)
  fileType: "Profile Photo";
  uploadDate: string;
  url: string;
  sizeKB: number;
  isPrimary?: boolean; // Primary flag for Profile Photos
}

// ============================================================================
// DASHBOARD & NAVIGATION MODELS
// ============================================================================

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

// ============================================================================
// FORM MODELS
// ============================================================================

/**
 * Applicant Personal Details
 * Used in job application forms
 */
export interface ApplicantPersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  // CV/Media are handled separately
}

/**
 * Job Application Form Model
 * Complete form data model for job applications
 */
export interface JobApplicationFormModel extends ApplicantPersonalDetails {
  jobId: string;
  coverLetterText?: string;
  cvFileName: string; // Name of the CV used
}

// Re-export Education and Experience models for convenience
export type { EducationModel } from "./education";
export type { ExperienceModel } from "./experience";

// NOTE: Static configuration arrays have been moved to @/constants/navigation.ts
// - DASHBOARD_STATS_STRUCTURE
// - USER_DASHBOARD_LINKS
// - PROFILE_MANAGEMENT_LINKS
// - PERSONAL_DETAILS_LINKS
