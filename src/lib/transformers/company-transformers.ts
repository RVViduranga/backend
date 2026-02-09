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
    description: company.description || additionalFields?.description || "",
    location: company.location,
    logoUrl: company.logoUrl,
    website: company.website || additionalFields?.website,
    headquarters: company.headquarters || company.location,
    establishedYear: company.establishedYear,
    employeeCountRange: company.employeeCountRange,
    industry: company.industry || additionalFields?.industry,
    activeJobsCount: company.activeJobsCount || additionalFields?.activeJobsCount || 0,
    totalApplicationsReceived: company.totalApplicationsReceived || additionalFields?.totalApplicationsReceived || 0,
    headerImageUrl: company.headerImageUrl,
  };
}

/**
 * Normalize company data from various sources (mock, localStorage, API)
 */
export function normalizeCompanyData(data: any): CompanyModel {
  // If already a CompanyModel, return as-is
  if (data.location && data.description) {
    return {
      id: data.id || "",
      name: data.name || "",
      description: data.description || "",
      location: data.location || data.headquarters || "",
      logoUrl: data.logoUrl,
      website: data.website,
      headerImageUrl: data.headerImageUrl,
      headquarters: data.headquarters,
      establishedYear: data.establishedYear,
      employeeCountRange: data.employeeCountRange,
      industry: data.industry,
      activeJobsCount: data.activeJobsCount || 0,
      totalApplicationsReceived: data.totalApplicationsReceived || 0,
    };
  }

  // Transform from CompanyDetailModel or legacy format
  return {
    id: data.id || "",
    name: data.name || "",
    description: data.description || "",
    location: data.location || data.headquarters || data.address || "",
    logoUrl: data.logoUrl || data.logo,
    website: data.website,
    headerImageUrl: data.headerImageUrl,
    headquarters: data.headquarters,
    establishedYear: data.establishedYear,
    employeeCountRange: data.employeeCountRange,
    industry: data.industry,
    activeJobsCount: data.activeJobsCount || 0,
    totalApplicationsReceived: data.totalApplicationsReceived || 0,
  };
}
