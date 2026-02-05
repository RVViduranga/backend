/**
 * Company Service - API calls for company-related operations
 *
 * ARCHITECTURE:
 * - MOCK MODE (default): Uses mock data only (set VITE_DATA_MODE=mock)
 * - BACKEND MODE: Uses backend API only (set VITE_DATA_MODE=backend)
 *
 * DATA MODE CONFIGURATION:
 * Set VITE_DATA_MODE in .env file:
 * - "mock" (default): Use mock data only (when backend is not available)
 * - "backend": Use backend API only (when backend is available)
 */
import apiClient from "./api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants";
import { env } from "@/config/env";
import {
  MOCK_COMPANY_DETAIL,
  MOCK_COMPANY_DETAILS,
  MOCK_COMPANY_SUMMARY,
  MOCK_COMPANY_SUMMARIES,
  MOCK_COMPANIES_LIST,
  MOCK_JOB_POSTS_MANAGE,
  MOCK_APPLICATIONS,
} from "@/mocks";
import { logger } from "@/lib/logger";
import type { CompanyModel, CompanyDetailModel, CompanySummaryModel } from "@/models/companies";
import type { JobSummaryModel, JobDetailModel } from "@/models/jobPosts";
import type { ApplicationModel } from "@/models/applications";
import { normalizeCompanyData, transformCompanyToDetailModel } from "@/lib/transformers/company-transformers";
import { normalizeJobDetail } from "@/lib/transformers/job-transformers";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

export interface CompanyListParams {
  search?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

export interface CompanyListResponse {
  companies: CompanyDetailModel[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyJobsParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface CompanyJobsResponse {
  jobs: JobSummaryModel[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyApplicationsParams {
  jobId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CompanyApplicationsResponse {
  applications: ApplicationModel[];
  total: number;
  page: number;
  limit: number;
}

// ============================================================================
// COMPANY SERVICE - MOCK/BACKEND MODE
// ============================================================================

export const companyService = {
  /**
   * Get company by ID (public)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses MOCK_COMPANY_DETAILS or MOCK_COMPANY_DETAIL
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getCompanyById(id: string): Promise<CompanyDetailModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getCompanyById");
      await new Promise((resolve) => setTimeout(resolve, 300));
    const detail = (MOCK_COMPANY_DETAILS[id] ||
      MOCK_COMPANY_DETAIL) as CompanyDetailModel;

    // Normalize to CompanyModel first, then transform to DetailModel
    const company = normalizeCompanyData(detail);
    
    // Preserve summary fields (industry) needed for display
    const summary = MOCK_COMPANY_SUMMARIES[id];
    return transformCompanyToDetailModel(company, {
      description: detail.description,
      website: detail.website,
      industry: summary?.industry,
      activeJobsCount: summary?.activeJobsCount,
      totalApplicationsReceived: summary?.totalApplicationsReceived,
    });
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getCompanyById");
    // Backend returns: { success: true, data: CompanyModel, message: string }
    const response = await apiClient.get<{ success: boolean; data: CompanyModel; message: string }>(
      API_ENDPOINTS.COMPANY_BY_ID(id)
    );
    // Extract data field and transform to CompanyDetailModel
    const company = response.data.data;
    return transformCompanyToDetailModel(company, {
      description: company.description || "",
      website: company.website,
      industry: company.industry,
      activeJobsCount: company.activeJobsCount,
      totalApplicationsReceived: company.totalApplicationsReceived,
    });
  },

  /**
   * Get all companies (with optional filters)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses MOCK_COMPANIES_LIST with client-side filtering
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getAllCompanies(
    params?: CompanyListParams
  ): Promise<CompanyListResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getAllCompanies");
      await new Promise((resolve) => setTimeout(resolve, 500));

    let companies = MOCK_COMPANIES_LIST.map((company) => {
      const detail = MOCK_COMPANY_DETAILS[company.id] || MOCK_COMPANY_DETAIL;
      return {
        ...detail,
        id: company.id,
        name: company.name,
        // Preserve summary fields needed for filtering and display
        industry: company.industry,
        activeJobsCount: company.activeJobsCount,
        totalApplicationsReceived: company.totalApplicationsReceived,
      } as CompanyDetailModel & Partial<CompanySummaryModel>;
    });

    // Client-side filtering (backend will handle this)
    if (params?.search) {
      const search = params.search.toLowerCase();
      companies = companies.filter((company) => {
        const companyWithIndustry = company as typeof company & {
          industry?: string;
        };
        return (
          company.name.toLowerCase().includes(search) ||
          (companyWithIndustry.industry &&
            companyWithIndustry.industry.toLowerCase().includes(search))
        );
      });
    }
    if (params?.industry) {
      companies = companies.filter((company) => {
        const companyWithIndustry = company as typeof company & {
          industry?: string;
        };
        return (
          companyWithIndustry.industry &&
          companyWithIndustry.industry
            .toLowerCase()
            .includes(params.industry!.toLowerCase())
        );
      });
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      companies: companies.slice(start, end),
      total: companies.length,
      page,
      limit,
    };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getAllCompanies");
    // Backend returns: { success: true, data: { items: CompanyModel[], total, page, limit, totalPages }, message: string }
    const response = await apiClient.get<{ 
      success: boolean; 
      data: { 
        items: CompanyModel[]; 
        total: number; 
        page: number; 
        limit: number; 
        totalPages: number;
      }; 
      message: string 
    }>(
      API_ENDPOINTS.COMPANIES,
      { params }
    );
    // Transform backend paginated response to frontend format
    const backendData = response.data.data;
    return {
      companies: backendData.items.map(company => 
        transformCompanyToDetailModel(company, {
          description: company.description || "",
          website: company.website,
          industry: company.industry,
          activeJobsCount: company.activeJobsCount,
          totalApplicationsReceived: company.totalApplicationsReceived,
        })
      ),
      total: backendData.total,
      page: backendData.page,
      limit: backendData.limit,
    };
  },

  /**
   * Get company profile (authenticated company)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses logged-in company ID from localStorage to get correct company data
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getProfile(): Promise<{
    profile: CompanyDetailModel;
    summary: CompanySummaryModel;
  }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getProfile");
      await new Promise((resolve) => setTimeout(resolve, 500));

    // Get logged-in company ID from localStorage (stored by AuthContext)
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "company" && user.id) {
          // Use the logged-in company's ID to get correct data
          const companyId = user.id;
          
          // ✅ FIXED: Check localStorage first for updated profile data (where updateProfile stores it)
          const updatedProfileData = localStorage.getItem(`company_profile_${companyId}`);
          if (updatedProfileData) {
            try {
              const updatedProfile = JSON.parse(updatedProfileData) as CompanyDetailModel;
              const summary = MOCK_COMPANY_SUMMARIES[companyId] || MOCK_COMPANY_SUMMARY;
              return {
                profile: updatedProfile,
                summary: summary as CompanySummaryModel,
              };
            } catch (error) {
              logger.error("Error parsing updated company profile:", error);
            }
          }
          
          // Fallback to getCompanyById if no updated data found
          const profile = await this.getCompanyById(companyId);
          const summary =
            MOCK_COMPANY_SUMMARIES[companyId] || MOCK_COMPANY_SUMMARY;
          return {
            profile: profile as CompanyDetailModel,
            summary: summary as CompanySummaryModel,
          };
        }
      }
    } catch (error) {
      logger.error("Error getting logged-in company ID:", error);
    }

    // Fallback to default if user ID not found
    return {
      profile: MOCK_COMPANY_DETAIL as CompanyDetailModel,
      summary: MOCK_COMPANY_SUMMARY as CompanySummaryModel,
    };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getProfile");
    
    // Get logged-in user info to find their company
    let userFullName: string | null = null;
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { name?: string; fullName?: string } = JSON.parse(storedUser);
        userFullName = user.name || user.fullName || null;
      }
    } catch (error) {
      logger.error("Error getting user info for company lookup:", error);
    }
    
    // Try to get company profile from backend endpoint
    try {
      const response = await apiClient.get<{ success: boolean; data: CompanyModel | null; message: string }>(
        API_ENDPOINTS.COMPANY_PROFILE
      );
      
      // Check if backend returned actual company data (not null)
      if (response.data.data && response.data.data.id) {
        const company = response.data.data;
        const profile = transformCompanyToDetailModel(company, {
          description: company.description || "",
          website: company.website,
          industry: company.industry,
          activeJobsCount: company.activeJobsCount,
          totalApplicationsReceived: company.totalApplicationsReceived,
        });
        return {
          profile,
          summary: {
            id: company.id,
            name: company.name,
            logoUrl: company.logoUrl || "",
            activeJobsCount: company.activeJobsCount || 0,
            totalApplicationsReceived: company.totalApplicationsReceived || 0,
            industry: company.industry || "",
          },
        };
      } else {
        // Backend endpoint not implemented or returned null - fallback to finding by name
        logger.warn("[CompanyService] Company profile endpoint returned null, trying to find company by name...");
        throw new Error("Company profile endpoint not implemented");
      }
    } catch (profileError: any) {
      // If profile endpoint fails or returns null, try to find company by matching user's fullName
      if (userFullName) {
        logger.info(`[CompanyService] Attempting to find company by name: '${userFullName}'`);
        try {
          // Get all companies and find one matching user's fullName
          const companiesResponse = await apiClient.get<any>(API_ENDPOINTS.COMPANIES);
          
          // Extract companies array from response
          let companies: any[] = [];
          if (Array.isArray(companiesResponse.data)) {
            companies = companiesResponse.data;
          } else if (companiesResponse.data?.data?.items && Array.isArray(companiesResponse.data.data.items)) {
            companies = companiesResponse.data.data.items;
          } else if (companiesResponse.data?.data && Array.isArray(companiesResponse.data.data)) {
            companies = companiesResponse.data.data;
          } else if (companiesResponse.data?.companies && Array.isArray(companiesResponse.data.companies)) {
            companies = companiesResponse.data.companies;
          }
          
          // Find company matching user's fullName
          const matchingCompany = companies.find(
            (company: any) => {
              const companyName = (company.name || "").trim();
              return companyName === userFullName || companyName.toLowerCase() === userFullName!.toLowerCase();
            }
          );
          
          if (matchingCompany) {
            logger.info(`[CompanyService] ✅ Found company by name: '${matchingCompany.name}'`);
            const company = matchingCompany;
            const profile = transformCompanyToDetailModel(company, {
              description: company.description || "",
              website: company.website,
              industry: company.industry,
              activeJobsCount: company.activeJobsCount,
              totalApplicationsReceived: company.totalApplicationsReceived,
            });
            return {
              profile,
              summary: {
                id: company.id || company._id,
                name: company.name,
                logoUrl: company.logoUrl || "",
                activeJobsCount: company.activeJobsCount || 0,
                totalApplicationsReceived: company.totalApplicationsReceived || 0,
                industry: company.industry || "",
              },
            };
          } else {
            logger.warn(`[CompanyService] ❌ No company found matching '${userFullName}'`);
            throw new Error(`No company found for user '${userFullName}'`);
          }
        } catch (findError: any) {
          logger.error("[CompanyService] Failed to find company by name:", findError);
          throw new Error("Company profile not found. Please ensure your company was created during registration.");
        }
      } else {
        logger.error("[CompanyService] Cannot find company - user fullName not available");
        throw new Error("Company profile not found. User information not available.");
      }
    }
  },

  /**
   * Update company profile
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Merges updates with current profile
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   * 
   * Transforms UI field names to backend-aligned format:
   * - headquarters → address
   * - logoUrl → logo
   */
  async updateProfile(
    updates: Partial<CompanyDetailModel>
  ): Promise<CompanyDetailModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for updateProfile");
      await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const currentProfile = await this.getProfile();
      
      // Transform UI field names to backend-aligned format
      const transformedUpdates: Partial<CompanyDetailModel> = { ...updates };
      
      // Merge with current profile (backend-aligned fields take precedence)
      const updatedProfile = { 
        ...currentProfile.profile, 
        ...transformedUpdates,
        // Ensure backend-aligned fields are set correctly
        location: transformedUpdates.location || currentProfile.profile.location || currentProfile.profile.headquarters || '',
        logoUrl: transformedUpdates.logoUrl || currentProfile.profile.logoUrl || undefined,
      } as CompanyDetailModel;
      
      // Keep UI convenience fields (description, website, etc.) if provided
      if (updates.description !== undefined) updatedProfile.description = updates.description;
      if (updates.website !== undefined) updatedProfile.website = updates.website;
      if (updates.establishedYear !== undefined) updatedProfile.establishedYear = updates.establishedYear;
      if (updates.employeeCountRange !== undefined) updatedProfile.employeeCountRange = updates.employeeCountRange;
      
      // ✅ FIXED: Store updated profile in localStorage so getProfile() can read it
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (storedUser) {
          const user: { id: string } = JSON.parse(storedUser);
          localStorage.setItem(`company_profile_${user.id}`, JSON.stringify(updatedProfile));
        }
      } catch (error) {
        logger.error("Error storing updated company profile:", error);
      }
      
      return updatedProfile;
    } catch (error) {
      logger.error("Error updating company profile:", error);
      throw error;
    }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for updateProfile");
    // Transform UI field names to backend format
    // Backend uses: location (not address), logoUrl (not logo)
    const backendUpdates: Partial<CompanyModel> = {};
    
    if (updates.name !== undefined) backendUpdates.name = updates.name;
    if (updates.location !== undefined) backendUpdates.location = updates.location;
    if (updates.headquarters !== undefined) backendUpdates.location = updates.headquarters; // Transform headquarters → location
    if (updates.logoUrl !== undefined) backendUpdates.logoUrl = updates.logoUrl;
    if (updates.description !== undefined) backendUpdates.description = updates.description;
    if (updates.website !== undefined) backendUpdates.website = updates.website;
    if (updates.headerImageUrl !== undefined) backendUpdates.headerImageUrl = updates.headerImageUrl;
    if (updates.headquarters !== undefined) backendUpdates.headquarters = updates.headquarters;
    if (updates.establishedYear !== undefined) backendUpdates.establishedYear = updates.establishedYear;
    if (updates.employeeCountRange !== undefined) backendUpdates.employeeCountRange = updates.employeeCountRange;
    if (updates.industry !== undefined) backendUpdates.industry = updates.industry;
    
    // Backend returns: { success: true, data: CompanyModel, message: string }
    const response = await apiClient.patch<{ success: boolean; data: CompanyModel; message: string }>(
      API_ENDPOINTS.COMPANY_PROFILE,
      backendUpdates
    );
    
    // Transform backend response back to UI format
    const company = response.data.data;
    return transformCompanyToDetailModel(company, {
      description: company.description || updates.description,
      website: company.website || updates.website,
      industry: company.industry || updates.industry,
      activeJobsCount: company.activeJobsCount || 0,
      totalApplicationsReceived: company.totalApplicationsReceived || 0,
    });
  },

  /**
   * Get company's job postings
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Loads from localStorage or uses MOCK_JOB_POSTS_MANAGE
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getJobs(params?: CompanyJobsParams): Promise<CompanyJobsResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getJobs");
      await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
      if (stored) {
        const jobs = JSON.parse(stored) as JobSummaryModel[];
        return {
          jobs: params?.status
            ? jobs.filter((job) => job.status === params.status)
            : jobs,
          total: jobs.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
        };
      }
      return {
        jobs: MOCK_JOB_POSTS_MANAGE as JobSummaryModel[],
        total: MOCK_JOB_POSTS_MANAGE.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };
    } catch (error) {
      logger.error("Error loading company jobs:", error);
      return {
        jobs: MOCK_JOB_POSTS_MANAGE as JobSummaryModel[],
        total: MOCK_JOB_POSTS_MANAGE.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
      };
    }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getJobs");
    // Backend returns: { success: true, data: JobModel[], message: string } or paginated
    const response = await apiClient.get<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_JOBS,
      { params }
    );
    // Handle both array and paginated responses
    const backendData = response.data.data;
    const jobs = Array.isArray(backendData) ? backendData : (backendData.items || []);
    return {
      jobs: jobs.map((job: any) => normalizeJobDetail(job)),
      total: backendData.total || jobs.length,
      page: backendData.page || 1,
      limit: backendData.limit || 20,
    };
  },

  /**
   * Get a single job by ID (company's job)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Loads from localStorage or uses jobService
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getJobById(id: string): Promise<JobDetailModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getJobById");
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
        if (stored) {
          const jobs = JSON.parse(stored) as JobDetailModel[];
          const foundJob = jobs.find((j) => j && j.id === id);
          if (foundJob) {
            return foundJob;
          }
        }
      } catch (error) {
        logger.error("Error loading company job from localStorage:", error);
      }

      // Fallback: Job not found in company jobs
      throw new Error("Job not found");
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getJobById");
    // Backend returns: { success: true, data: JobModel, message: string }
    const response = await apiClient.get<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_JOB_BY_ID(id)
    );
    return normalizeJobDetail(response.data.data);
  },

  /**
   * Create a new job posting
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Saves to localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async createJob(jobData: Partial<JobDetailModel>): Promise<JobDetailModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for createJob");
      await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      // Get company profile for job creation
      const companyProfile = await this.getProfile();
      
      // Generate job ID
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Create job with required fields (backend-aligned)
      // Ensure salaryRange is always an object
      const salaryRange = typeof jobData.salaryRange === "object" && jobData.salaryRange !== null && "min" in jobData.salaryRange && "max" in jobData.salaryRange
        ? jobData.salaryRange
        : { min: 0, max: 0 };
      
      // Use applicationDeadline (backend field)
      const applicationDeadline = jobData.applicationDeadline || (jobData as any).closingDate || "";
      
      // Convert salaryRange object to string format for backend
      const salaryRangeString = typeof jobData.salaryRange === "string" 
        ? jobData.salaryRange 
        : `${(jobData.salaryRange as any)?.min || 0}-${(jobData.salaryRange as any)?.max || 0}`;
      
      const newJob: JobDetailModel = {
        // Spread jobData first to get all fields
        ...jobData,
        // Override with required fields and ensure backend-aligned format
        id: jobId,
        title: jobData.title || "Untitled Job",
        description: jobData.description || "",
        company: jobData.company || companyProfile.profile,
        location: jobData.location || "Not specified",
        jobType: jobData.jobType || "Full-Time",
        postedDate: jobData.postedDate || new Date().toISOString().split("T")[0],
        experienceLevel: jobData.experienceLevel || "Not specified",
        salaryRange: salaryRangeString, // ✅ Backend uses string format "min-max"
        applicationDeadline, // ✅ Backend uses applicationDeadline
        status: jobData.status || "Active",
        responsibilities: jobData.responsibilities || [],
        qualifications: jobData.qualifications || [],
      } as JobDetailModel;

      // Save to localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
      const jobs = stored ? JSON.parse(stored) : [];
      jobs.push(newJob);
      localStorage.setItem(STORAGE_KEYS.COMPANY_JOBS, JSON.stringify(jobs));

      return newJob;
    } catch (error) {
      logger.error("Error creating job:", error);
      throw error;
    }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for createJob");
    // Transform jobData to backend format
    // Backend expects: salaryRange as string "min-max", applicationDeadline (not closingDate)
    const backendJobData: any = {
      title: jobData.title,
      company: (jobData.company as any)?.id || jobData.company, // Extract company ID if object
      location: jobData.location,
      jobType: jobData.jobType,
      description: jobData.description,
      responsibilities: jobData.responsibilities || [],
      qualifications: jobData.qualifications || [],
      salaryRange: typeof jobData.salaryRange === "string" 
        ? jobData.salaryRange 
        : `${(jobData.salaryRange as any)?.min || 0}-${(jobData.salaryRange as any)?.max || 0}`, // Convert object to string
      applicationDeadline: jobData.applicationDeadline || (jobData as any).closingDate, // Use applicationDeadline
      industry: jobData.industry,
      experienceLevel: jobData.experienceLevel,
    };
    
    // Backend returns: { success: true, data: JobModel, message: string }
    const response = await apiClient.post<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_JOBS,
      backendJobData
    );
    return normalizeJobDetail(response.data.data);
  },

  /**
   * Update a job posting
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Updates localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async updateJob(
    id: string,
    updates: Partial<JobDetailModel>
  ): Promise<JobDetailModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for updateJob");
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
        if (stored) {
          const jobs = JSON.parse(stored) as JobDetailModel[];
          const jobIndex = jobs.findIndex((job) => job.id === id);
          if (jobIndex !== -1) {
            jobs[jobIndex] = { ...jobs[jobIndex], ...updates } as JobDetailModel;
            localStorage.setItem(STORAGE_KEYS.COMPANY_JOBS, JSON.stringify(jobs));
            return jobs[jobIndex];
          }
        }
        throw new Error("Job not found");
      } catch (error) {
        logger.error("Error updating job:", error);
        throw error;
      }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for updateJob");
    // Transform updates to backend format
    const backendUpdates: any = { ...updates };
    // Convert salaryRange object to string if needed
    if (backendUpdates.salaryRange && typeof backendUpdates.salaryRange === "object") {
      backendUpdates.salaryRange = `${backendUpdates.salaryRange.min}-${backendUpdates.salaryRange.max}`;
    }
    // Backend uses applicationDeadline (already correct)
    // Extract company ID if company is an object
    if (backendUpdates.company && typeof backendUpdates.company === "object") {
      backendUpdates.company = (backendUpdates.company as any).id;
    }
    
    // Backend returns: { success: true, data: JobModel, message: string }
    const response = await apiClient.patch<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_JOB_BY_ID(id),
      backendUpdates
    );
    return normalizeJobDetail(response.data.data);
  },

  /**
   * Delete a job posting
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Removes from localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async deleteJob(id: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for deleteJob");
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
        if (stored) {
          const jobs = JSON.parse(stored) as JobSummaryModel[];
          const updatedJobs = jobs.filter((job) => job.id !== id);
          localStorage.setItem(STORAGE_KEYS.COMPANY_JOBS, JSON.stringify(updatedJobs));
        }
      } catch (error) {
        logger.error("Error deleting job:", error);
        throw error;
      }
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for deleteJob");
    await apiClient.delete(API_ENDPOINTS.COMPANY_JOB_BY_ID(id));
  },

  /**
   * Get applications for a specific job
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Filters applications by jobId from localStorage or mock data
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getJobApplications(
    jobId: string,
    params?: CompanyApplicationsParams
  ): Promise<CompanyApplicationsResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getJobApplications");
      await new Promise((resolve) => setTimeout(resolve, 300));

    // Get company ID to filter applications
    const companyProfile = await this.getProfile();
    const companyId = companyProfile.profile.id;
    const companyJobs = await this.getJobs();
    const companyJobIds = new Set(companyJobs.jobs.map((job) => job.id));

    // Filter applications by jobId and company
    let applications: ApplicationModel[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_APPLICATIONS);
      if (stored) {
        applications = JSON.parse(stored) as ApplicationModel[];
      } else {
        applications = MOCK_APPLICATIONS as ApplicationModel[];
      }
    } catch (error) {
      logger.error("Error loading applications:", error);
      applications = MOCK_APPLICATIONS as ApplicationModel[];
    }

    // Filter by jobId and company's jobs
    // Backend uses: job (not jobPost), applicant (not user)
    applications = applications.filter(
      (app) => {
        const appJobId = (app as any).job || (app as any).jobPost || (app as any).jobId; // Backend uses "job"
        return appJobId === jobId && companyJobIds.has(appJobId);
      }
    );

    // Apply status filter if provided
    if (params?.status) {
      applications = applications.filter((app) => app.status === params.status);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      applications: applications.slice(start, end),
      total: applications.length,
      page,
      limit,
    };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getJobApplications");
    // Backend returns: { success: true, data: ApplicationModel[], message: string } or paginated
    const response = await apiClient.get<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_JOB_APPLICATIONS(jobId),
      { params }
    );
    const backendData = response.data.data;
    const applications = Array.isArray(backendData) ? backendData : (backendData.items || []);
    return {
      applications: applications.map((app: any) => ({
        ...app,
        jobPost: app.job, // Transform backend "job" to frontend "jobPost" for compatibility
        user: app.applicant, // Transform backend "applicant" to frontend "user" for compatibility
        date: app.appliedAt, // Transform backend "appliedAt" to frontend "date" for compatibility
        cvUrl: app.cvFilePath, // Transform backend "cvFilePath" to frontend "cvUrl" for compatibility
      })),
      total: backendData.total || applications.length,
      page: backendData.page || 1,
      limit: backendData.limit || 20,
    };
  },

  /**
   * Get all company applications (across all jobs)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Loads from localStorage or uses MOCK_APPLICATIONS with filtering
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getApplications(
    params?: CompanyApplicationsParams
  ): Promise<CompanyApplicationsResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for getApplications");
      await new Promise((resolve) => setTimeout(resolve, 300));

    // Get company ID from profile (for filtering applications by company)
    const companyProfile = await this.getProfile();
    const companyId = companyProfile.profile.id;

    // Get company's jobs to filter applications
    const companyJobs = await this.getJobs();
    const companyJobIds = new Set(companyJobs.jobs.map((job) => job.id));

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPANY_APPLICATIONS);
      if (stored) {
        let applications = JSON.parse(stored) as ApplicationModel[];

        // Filter by company: only show applications for this company's jobs
        // Support both jobId (legacy) and jobPost (backend-aligned) field names
        applications = applications.filter((app) =>
          companyJobIds.has((app as any).jobPost || (app as any).jobId)
        );

        // Apply additional filters
        if (params?.jobId) {
          applications = applications.filter(
            (app) => (app as any).jobPost === params.jobId || (app as any).jobId === params.jobId
          );
        }
        if (params?.status) {
          applications = applications.filter(
            (app) => app.status === params.status
          );
        }

        // Pagination
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
          applications: applications.slice(start, end),
          total: applications.length,
          page,
          limit,
        };
      }

      // Filter mock applications by company's job IDs
      // Support both jobId (legacy) and jobPost (backend-aligned) field names
      let applications = (MOCK_APPLICATIONS as ApplicationModel[]).filter(
        (app) => companyJobIds.has((app as any).jobPost || (app as any).jobId)
      );

      // Apply additional filters
      if (params?.jobId) {
        applications = applications.filter(
          (app) => (app as any).jobPost === params.jobId || (app as any).jobId === params.jobId
        );
      }
      if (params?.status) {
        applications = applications.filter(
          (app) => app.status === params.status
        );
      }

      // Pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        applications: applications.slice(start, end),
        total: applications.length,
        page,
        limit,
      };
    } catch (error) {
      logger.error("Error loading company applications:", error);

      // On error, still filter by company's jobs
      let applications = (MOCK_APPLICATIONS as ApplicationModel[]).filter(
        (app) => {
          const appJobId = (app as any).job || (app as any).jobPost || (app as any).jobId;
          return companyJobIds.has(appJobId);
        }
      );

      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        applications: applications.slice(start, end),
        total: applications.length,
        page,
        limit,
      };
    }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for getApplications");
    // Backend returns: { success: true, data: ApplicationModel[], message: string } or paginated
    const response = await apiClient.get<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.COMPANY_APPLICATIONS,
      { params }
    );
    const backendData = response.data.data;
    const applications = Array.isArray(backendData) ? backendData : (backendData.items || []);
    return {
      applications: applications.map((app: any) => ({
        ...app,
        jobPost: app.job, // Transform backend "job" to frontend "jobPost" for compatibility
        user: app.applicant, // Transform backend "applicant" to frontend "user" for compatibility
        date: app.appliedAt, // Transform backend "appliedAt" to frontend "date" for compatibility
        cvUrl: app.cvFilePath, // Transform backend "cvFilePath" to frontend "cvUrl" for compatibility
      })),
      total: backendData.total || applications.length,
      page: backendData.page || 1,
      limit: backendData.limit || 20,
    };
  },

  /**
   * Update application status
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Updates localStorage (both userApplications and companyApplications)
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationModel["status"]
  ): Promise<ApplicationModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[CompanyService] Using MOCK mode for updateApplicationStatus");
      await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      // Update companyApplications (company side view)
      const companyStored = localStorage.getItem(
        STORAGE_KEYS.COMPANY_APPLICATIONS
      );
      if (companyStored) {
        let companyApplications = JSON.parse(
          companyStored
        ) as ApplicationModel[];
        const updatedCompanyApps = companyApplications.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        );
        localStorage.setItem(
          STORAGE_KEYS.COMPANY_APPLICATIONS,
          JSON.stringify(updatedCompanyApps)
        );

        const updatedApp = updatedCompanyApps.find(
          (app) => app.id === applicationId
        );
        if (updatedApp) {
          // Also update userApplications (user side view) to sync status
          const userStored = localStorage.getItem(
            STORAGE_KEYS.USER_APPLICATIONS
          );
          if (userStored) {
            try {
              let userApplications = JSON.parse(
                userStored
              ) as ApplicationModel[];
              const updatedUserApps = userApplications.map((app) =>
                app.id === applicationId ? { ...app, status } : app
              );
              localStorage.setItem(
                STORAGE_KEYS.USER_APPLICATIONS,
                JSON.stringify(updatedUserApps)
              );
            } catch (userError) {
              logger.warn(
                "Could not sync status to userApplications:",
                userError
              );
            }
          }

          return updatedApp;
        }
      }
      throw new Error("Application not found in localStorage");
    } catch (error) {
      logger.error("Error updating application status:", error);
      throw error;
    }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[CompanyService] Using BACKEND mode for updateApplicationStatus");
    const response = await apiClient.patch<ApplicationModel>(
      `${API_ENDPOINTS.COMPANY_APPLICATIONS}/${applicationId}`,
      { status }
    );
    return response.data;
  },

  /**
   * Calculate dashboard statistics from jobs and applications
   * Business logic for aggregating company dashboard metrics
   *
   * @param jobs - Array of company jobs
   * @param applications - Array of company applications
   * @returns Calculated dashboard statistics
   */
  calculateDashboardStats(
    jobs: JobSummaryModel[],
    applications: ApplicationModel[]
  ): {
    activeJobsCount: number;
    totalApplicationsReceived: number;
    totalViews: number;
    pendingApplications: number;
  } {
    const activeJobsCount = jobs.filter(
      (job) => job.status === "Active"
    ).length;
    const totalApplicationsReceived = applications.length;
    const totalViews = jobs.reduce(
      (sum, job) => sum + (job.views || 0),
      0
    );
    const pendingApplications = applications.filter(
      (app) => app.status === "Pending" || app.status === "Reviewed" // Backend uses capitalized status values
    ).length;

    return {
      activeJobsCount,
      totalApplicationsReceived,
      totalViews,
      pendingApplications,
    };
  },
};

export default companyService;
