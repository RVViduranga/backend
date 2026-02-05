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
 * - mediaFiles: MediaFileModel[] (embedded array)
 */
export interface ProfileModel {
  id: string; // _id from backend (ObjectId)
  user: string; // Reference to User ID (ObjectId)
  fullName: string; // ✅ Backend field name
  email: string; // ✅ Backend field name
  phone?: string; // ✅ Backend field name
  headline?: string; // ✅ Backend field name (not "bio")
  location?: string; // ✅ Backend field name
  avatarUrl?: string; // ✅ Backend field name
  cvUploaded: boolean; // ✅ Backend field name (default: false)
  education: EducationModel[]; // ✅ Backend embedded array
  experience: ExperienceModel[]; // ✅ Backend embedded array
  mediaFiles: MediaFileModel[]; // ✅ Backend embedded array
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
 * CV Model (UI Display)
 * Used for displaying CV information in UI
 */
export interface CVModel {
  id: string;
  name: string;
  dateUploaded: string;
  isPrimary: boolean;
  sizeMB: number;
  downloadUrl: string;
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
 * MediaFileModel (Backend Schema Alignment)
 * Embedded in Profile.mediaFiles array
 * 
 * BACKEND SCHEMA (backend/src/models/Profile.ts):
 * - id: string
 * - fileName: string
 * - fileType: "CV" | "Portfolio Image" | "Portfolio Document"
 * - uploadDate: string
 * - url: string
 * - sizeKB: number
 */
export interface MediaFileModel {
  id: string;
  fileName: string;
  fileType: "CV" | "Portfolio Image" | "Portfolio Document";
  uploadDate: string;
  url: string;
  sizeKB: number;
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
