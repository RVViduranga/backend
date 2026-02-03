/**
 * Company Service - API calls for company-related operations
 *
 * ARCHITECTURE:
 * - MOCK DATA (CURRENT): Uses mock data and localStorage for development
 * - BACKEND API (ENABLE LATER): Real API calls ready to uncomment
 *
 * TO ENABLE BACKEND:
 * 1. Uncomment BACKEND API sections
 * 2. Comment out/remove MOCK DATA sections
 * 3. Remove mock data imports
 */
import apiClient from "./api-client";
import { API_ENDPOINTS, STORAGE_KEYS } from "@/constants";
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
import type { CompanyModel, CompanyDetailModel, CompanySummaryModel } from "@/models/company";
import type { JobSummaryModel, JobDetailModel } from "@/models/job";
import type { ApplicationModel } from "@/models/application";
import { normalizeCompanyData, transformCompanyToDetailModel } from "@/lib/transformers/company-transformers";

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
// COMPANY SERVICE - MOCK DATA (CURRENT MODE)
// ============================================================================

export const companyService = {
  /**
   * Get company by ID (public)
   *
   * MOCK: Uses MOCK_COMPANY_DETAILS or MOCK_COMPANY_DETAIL
   * BACKEND: Will use GET /companies/:id
   */
  async getCompanyById(id: string): Promise<CompanyDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<CompanyModel>(
    //   API_ENDPOINTS.COMPANY_BY_ID(id)
    // );
    // const company = normalizeCompanyData(response.data);
    // return transformCompanyToDetailModel(company, { ... });

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get all companies (with optional filters)
   *
   * MOCK: Uses MOCK_COMPANIES_LIST with client-side filtering
   * BACKEND: Will use GET /companies with query params
   */
  async getAllCompanies(
    params?: CompanyListParams
  ): Promise<CompanyListResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<CompanyListResponse>(
    //   API_ENDPOINTS.COMPANIES,
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get company profile (authenticated company)
   *
   * MOCK: Uses logged-in company ID from localStorage to get correct company data
   * BACKEND: Will use GET /companies/profile
   */
  async getProfile(): Promise<{
    profile: CompanyDetailModel;
    summary: CompanySummaryModel;
  }> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<{
    //   profile: CompanyDetailModel;
    //   summary: CompanySummaryModel;
    // }>(API_ENDPOINTS.COMPANY_PROFILE);
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get logged-in company ID from localStorage (stored by AuthContext)
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "company" && user.id) {
          // Use the logged-in company's ID to get correct data
          const companyId = user.id;
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
  },

  /**
   * Update company profile
   *
   * MOCK: Merges updates with current profile
   * BACKEND: PATCH /companies/profile
   * 
   * Transforms UI field names to backend-aligned format:
   * - headquarters → address
   * - logoUrl → logo
   */
  async updateProfile(
    updates: Partial<CompanyDetailModel>
  ): Promise<CompanyDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // Transform UI field names to backend format
    // const backendUpdates: Partial<CompanyModel> = {};
    // 
    // if (updates.name !== undefined) backendUpdates.name = updates.name;
    // if (updates.address !== undefined) backendUpdates.address = updates.address;
    // if (updates.headquarters !== undefined) backendUpdates.address = updates.headquarters; // Transform
    // if (updates.logo !== undefined) backendUpdates.logo = updates.logo;
    // if (updates.logoUrl !== undefined) backendUpdates.logo = updates.logoUrl; // Transform
    // 
    // const response = await apiClient.patch<CompanyModel>(
    //   API_ENDPOINTS.COMPANY_PROFILE,
    //   backendUpdates
    // );
    // 
    // // Transform backend response back to UI format
    // return transformCompanyToDetailModel(response.data);

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const currentProfile = await this.getProfile();
      
      // Transform UI field names to backend-aligned format
      const transformedUpdates: Partial<CompanyDetailModel> = { ...updates };
      
      // Transform headquarters → address
      if ('headquarters' in updates && updates.headquarters !== undefined) {
        transformedUpdates.address = updates.headquarters;
        delete transformedUpdates.headquarters;
      }
      
      // Transform logoUrl → logo
      if ('logoUrl' in updates && updates.logoUrl !== undefined) {
        transformedUpdates.logo = updates.logoUrl;
        delete transformedUpdates.logoUrl;
      }
      
      // Merge with current profile (backend-aligned fields take precedence)
      const updatedProfile = { 
        ...currentProfile.profile, 
        ...transformedUpdates,
        // Ensure backend-aligned fields are set correctly
        address: transformedUpdates.address || currentProfile.profile.address || currentProfile.profile.headquarters || '',
        logo: transformedUpdates.logo || currentProfile.profile.logo || currentProfile.profile.logoUrl || undefined,
      } as CompanyDetailModel;
      
      // Keep UI convenience fields (description, website, etc.) if provided
      if (updates.description !== undefined) updatedProfile.description = updates.description;
      if (updates.website !== undefined) updatedProfile.website = updates.website;
      if (updates.establishedYear !== undefined) updatedProfile.establishedYear = updates.establishedYear;
      if (updates.employeeCountRange !== undefined) updatedProfile.employeeCountRange = updates.employeeCountRange;
      
      return updatedProfile;
    } catch (error) {
      logger.error("Error updating company profile:", error);
      throw error;
    }
  },

  /**
   * Get company's job postings
   *
   * MOCK: Loads from localStorage or uses MOCK_JOB_POSTS_MANAGE
   * BACKEND: Will use GET /companies/jobs
   */
  async getJobs(params?: CompanyJobsParams): Promise<CompanyJobsResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<CompanyJobsResponse>(
    //   API_ENDPOINTS.COMPANY_JOBS,
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get a single job by ID (company's job)
   *
   * MOCK: Loads from localStorage or uses jobService
   * BACKEND: GET /companies/jobs/:id
   */
  async getJobById(id: string): Promise<JobDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobDetailModel>(
    //   API_ENDPOINTS.COMPANY_JOB_BY_ID(id)
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Create a new job posting
   *
   * MOCK: Saves to localStorage
   * BACKEND: POST /companies/jobs
   */
  async createJob(jobData: Partial<JobDetailModel>): Promise<JobDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.post<JobDetailModel>(
    //   API_ENDPOINTS.COMPANY_JOBS,
    //   jobData
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
      
      // Use closingDate (backend field) instead of applicationDeadline
      // Handle backward compatibility for legacy applicationDeadline field
      const closingDate = jobData.closingDate || (jobData as any).applicationDeadline || "";
      
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
        salaryRange, // ✅ Always an object (overrides any legacy string value)
        closingDate, // ✅ Use closingDate (backend field, overrides applicationDeadline)
        postedBy: jobData.postedBy || "", // ✅ Set postedBy (User ID)
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
  },

  /**
   * Update a job posting
   *
   * MOCK: Updates localStorage
   * BACKEND: PATCH /companies/jobs/:id
   */
  async updateJob(
    id: string,
    updates: Partial<JobDetailModel>
  ): Promise<JobDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.patch<JobDetailModel>(
    //   API_ENDPOINTS.COMPANY_JOB_BY_ID(id),
    //   updates
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Delete a job posting
   *
   * MOCK: Removes from localStorage
   * BACKEND: DELETE /companies/jobs/:id
   */
  async deleteJob(id: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.delete(API_ENDPOINTS.COMPANY_JOB_BY_ID(id));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get applications for a specific job
   *
   * MOCK: Filters applications by jobId from localStorage or mock data
   * BACKEND: GET /companies/jobs/:id/applications
   */
  async getJobApplications(
    jobId: string,
    params?: CompanyApplicationsParams
  ): Promise<CompanyApplicationsResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<CompanyApplicationsResponse>(
    //   API_ENDPOINTS.COMPANY_JOB_APPLICATIONS(jobId),
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
    // Handle backward compatibility: use jobPost (backend field) with fallback to jobId (legacy)
    applications = applications.filter(
      (app) => {
        const appJobId = app.jobPost || (app as any).jobId;
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
  },

  /**
   * Get all company applications (across all jobs)
   *
   * MOCK: Loads from localStorage or uses MOCK_APPLICATIONS with filtering
   * BACKEND: Will use GET /companies/applications
   */
  async getApplications(
    params?: CompanyApplicationsParams
  ): Promise<CompanyApplicationsResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<CompanyApplicationsResponse>(
    //   API_ENDPOINTS.COMPANY_APPLICATIONS,
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
          const appJobId = app.jobPost || (app as any).jobId;
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
  },

  /**
   * Update application status
   *
   * MOCK: Updates localStorage (both userApplications and companyApplications)
   * BACKEND: Will use PATCH /companies/applications/:id
   */
  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationModel["status"]
  ): Promise<ApplicationModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.patch<ApplicationModel>(
    //   `${API_ENDPOINTS.COMPANY_APPLICATIONS}/${applicationId}`,
    //   { status }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
      (app) => app.status === "pending" || app.status === "reviewing"
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
