/**
 * Companies Collection Model - Backend-Aligned & UI Convenience
 * 
 * This model aligns with the backend `companies` collection schema.
 * Maps to: companies collection
 */

import { NavigationLinkModel } from "./site-data";

// ============================================================================
// COMPANY MODEL (Backend Schema Alignment)
// ============================================================================

/**
 * Company Model (Backend Schema Alignment)
 * Maps to backend `companies` collection exactly
 * 
 * BACKEND SCHEMA (backend/src/models/Company.ts):
 * - name: string (required)
 * - description: string (required)
 * - location: string (required) - NOT "address"
 * - website?: string
 * - logoUrl?: string - NOT "logo"
 * - headerImageUrl?: string
 * - headquarters?: string
 * - establishedYear?: number
 * - employeeCountRange?: string
 * - industry?: string
 * - activeJobsCount?: number (default: 0)
 * - totalApplicationsReceived?: number (default: 0)
 */
export interface CompanyModel {
  id: string; // _id from backend (ObjectId)
  name: string; // ✅ Required
  description: string; // ✅ Required
  location: string; // ✅ Required - Backend uses "location" not "address"
  website?: string; // ✅ Optional
  logoUrl?: string; // ✅ Backend uses "logoUrl" not "logo"
  headerImageUrl?: string; // ✅ Optional
  headquarters?: string; // ✅ Optional
  establishedYear?: number; // ✅ Optional
  employeeCountRange?: string; // ✅ Optional
  industry?: string; // ✅ Optional
  activeJobsCount?: number; // ✅ Default: 0
  totalApplicationsReceived?: number; // ✅ Default: 0
}

// ============================================================================
// UI CONVENIENCE MODELS
// ============================================================================

/**
 * Company Small Model (UI Convenience)
 * Minimal company info for job cards, etc.
 */
export interface CompanySmallModel {
  id: string;
  name: string;
  logoUrl: string; // UI convenience (may be computed from logo)
}

export interface CompanyBrandingModel {
  logoUrl: string;
  headerImageUrl?: string;
}

/**
 * Company Summary Model (UI Convenience)
 * Includes computed/aggregated fields
 */
export interface CompanySummaryModel extends CompanySmallModel {
  activeJobsCount: number; // Computed/aggregated
  totalApplicationsReceived: number; // Computed/aggregated
  industry: string; // May come from separate field or computed
}

/**
 * Company Detail Model (UI Convenience)
 * Extended view with additional UI fields
 * Combines CompanyModel with additional display fields
 */
export interface CompanyDetailModel {
  id: string;
  name: string;
  description: string; // ✅ Required in backend
  location: string; // ✅ Backend uses "location" not "address"
  logoUrl?: string; // ✅ Backend uses "logoUrl" not "logo"
  headerImageUrl?: string; // ✅ From CompanyBrandingModel
  website?: string;
  headquarters?: string;
  establishedYear?: number;
  employeeCountRange?: string;
  industry?: string;
  activeJobsCount?: number;
  totalApplicationsReceived?: number;
}

export interface DashboardLinkModel extends NavigationLinkModel {
  description: string;
}

// NOTE: Static configuration array has been moved to @/constants/navigation.ts
// - COMPANY_DASHBOARD_LINKS
