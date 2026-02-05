/**
 * Company Transformers - Convert between backend models and UI models
 * 
 * Handles transformation between:
 * - Backend-aligned models (CompanyModel)
 * - UI convenience models (CompanyDetailModel)
 */

import type { CompanyModel, CompanyDetailModel } from "@/models/companies";

/**
 * Transform CompanyModel to CompanyDetailModel (UI convenience)
 * Adds UI-specific fields for display
 */
export function transformCompanyToDetailModel(
  company: CompanyModel,
  additionalFields?: {
    description?: string;
    website?: string;
    industry?: string;
    activeJobsCount?: number;
    totalApplicationsReceived?: number;
  }
): CompanyDetailModel {
  return {
    id: company.id,
    name: company.name,
    address: company.address,
    logo: company.logo,
    logoUrl: company.logo || "", // UI convenience
    isVerified: company.isVerified,
    
    // UI convenience fields (may not be in backend)
    description: additionalFields?.description,
    website: additionalFields?.website,
    headquarters: company.address, // Alias for address
    establishedYear: undefined,
    employeeCountRange: undefined,
    industry: additionalFields?.industry,
    activeJobsCount: additionalFields?.activeJobsCount,
    totalApplicationsReceived: additionalFields?.totalApplicationsReceived,
  };
}

/**
 * Normalize company data from various sources (mock, localStorage, API)
 */
export function normalizeCompanyData(data: any): CompanyModel {
  // If already a CompanyModel, return as-is
  if (data.isVerified !== undefined && data.address) {
    return {
      id: data.id,
      name: data.name,
      address: data.address || data.headquarters || "",
      logo: data.logo || data.logoUrl || undefined,
      isVerified: data.isVerified || false,
    };
  }

  // Transform from CompanyDetailModel or legacy format
  return {
    id: data.id || "",
    name: data.name || "",
    address: data.address || data.headquarters || "",
    logo: data.logo || data.logoUrl || undefined,
    isVerified: data.isVerified || false,
  };
}
