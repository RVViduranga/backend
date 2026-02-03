/**
 * Company Data - Type Definitions and Static Configuration
 */

import { NavigationLinkModel } from "./site-data";

/**
 * Company Model (Backend Schema Alignment)
 * Maps to backend `companies` collection
 */
export interface CompanyModel {
  id: string; // _id from backend (ObjectId)
  name: string;
  address: string; // ✅ Changed from headquarters (backend aligned)
  logo?: string; // File URL/Path (Upload) - ✅ Changed from logoUrl
  isVerified: boolean; // ✅ Added (backend aligned)
}

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
export interface CompanyDetailModel extends CompanyBrandingModel {
  id: string;
  name: string;
  address: string; // ✅ Maps to backend address
  logo?: string; // ✅ Maps to backend logo
  isVerified: boolean; // ✅ Added (backend aligned)
  
  // UI convenience fields (may not be in backend)
  description?: string;
  website?: string;
  headquarters?: string; // Alias for address or separate field
  establishedYear?: number;
  employeeCountRange?: string;
  industry?: string; // UI convenience (may come from separate field or computed)
  activeJobsCount?: number; // Computed/aggregated
  totalApplicationsReceived?: number; // Computed/aggregated
}

export interface DashboardLinkModel extends NavigationLinkModel {
  description: string;
}

// NOTE: Static configuration array has been moved to @/constants/navigation.ts
// - COMPANY_DASHBOARD_LINKS

// ============================================================================
// STATIC CONFIGURATION (if needed)
// ============================================================================
