/**
 * Job Service - API calls for job-related operations
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
  MOCK_JOB_SEARCH_RESULTS,
  MOCK_JOB_DETAIL,
  MOCK_JOB_SEARCH_HERO,
} from "@/mocks";
import { logger } from "@/lib/logger";
import type { JobSummaryModel, JobDetailModel } from "@/models/jobPosts";
import type { UserApplicationModel, ApplicationModel } from "@/models/applications";
import { normalizeJobDetail } from "@/lib/transformers/job-transformers";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

export interface JobSearchParams {
  query?: string;
  location?: string[];
  industry?: string[];
  experienceLevel?: string[];
  jobType?: string[];
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
  sortBy?: "recent" | "relevant";
}

export interface JobSearchResponse {
  jobs: JobSummaryModel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobApplicationData {
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeFile: File | null;
  location?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
}

export interface JobApplicationResponse {
  applicationId: string;
  message: string;
  status: "success" | "error";
}

export interface FilterOptionsResponse {
  locations: string[];
  industries: string[];
  experienceLevels: string[];
  jobTypes: string[];
}

// ============================================================================
// JOB SERVICE - MOCK/BACKEND MODE
// ============================================================================

/**
 * Helper function: Get mock data with filtering and pagination
 * Used as fallback when backend is unavailable
 */
async function getMockJobSearchResults(
  params: JobSearchParams
): Promise<JobSearchResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  let jobs = [...MOCK_JOB_SEARCH_RESULTS] as JobSummaryModel[];

  // Merge company-created jobs from localStorage (temporary mock persistence)
  try {
    const companyJobsStored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
    if (companyJobsStored) {
      const companyJobs = JSON.parse(companyJobsStored) as JobSummaryModel[];
      if (companyJobs && companyJobs.length > 0) {
        const existingIds = new Set(jobs.map((j) => j.id));
        const newJobs = companyJobs.filter((j) => !existingIds.has(j.id));
        jobs = [...jobs, ...newJobs];
      }
    }
  } catch (error) {
    logger.error("Error loading company jobs for search:", error);
  }

  // Client-side filtering (backend will handle this)
  if (params.query) {
    const query = params.query.toLowerCase();
    jobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.name.toLowerCase().includes(query) ||
        (job.industry && job.industry.toLowerCase().includes(query))
    );
  }

  if (params.location && params.location.length > 0) {
    jobs = jobs.filter((job) => params.location!.includes(job.location));
  }

  if (params.jobType && params.jobType.length > 0) {
    jobs = jobs.filter((job) => params.jobType!.includes(job.jobType));
  }

  if (params.industry && params.industry.length > 0) {
    jobs = jobs.filter(
      (job) => job.industry && params.industry!.includes(job.industry)
    );
  }

  if (params.experienceLevel && params.experienceLevel.length > 0) {
    jobs = jobs.filter(
      (job) =>
        job.experienceLevel &&
        params.experienceLevel!.includes(job.experienceLevel)
    );
  }

  // Sort results
  if (params.sortBy === "recent" || params.sortBy === "relevant") {
    jobs.sort((a, b) => {
      const dateA = new Date(a.postedDate).getTime();
      const dateB = new Date(b.postedDate).getTime();
      return dateB - dateA;
    });
  }

  // Pagination
  const total = jobs.length;
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    jobs: jobs.slice(start, end),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const jobService = {
  /**
   * Search for jobs with filters and pagination
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses mock data only
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[JobService] Using MOCK mode for job search");
      return getMockJobSearchResults(params);
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for job search");
    // Backend search returns: { jobs: JobSummary[], total, page, limit, totalPages }
    // Note: Backend uses salaryRange as string, but transforms it in getJobById
    const response = await apiClient.get<{
      jobs: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(
      API_ENDPOINTS.JOB_SEARCH,
      { params }
    );
    // Transform backend jobs to frontend format
    return {
      jobs: response.data.jobs.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.company || { id: "", name: "", logoUrl: "" },
        location: job.location,
        jobType: job.jobType,
        postedDate: job.postedDate,
        industry: job.industry,
        experienceLevel: job.experienceLevel,
        status: job.status,
      })),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
    };
  },

  /**
   * Get all jobs (with optional filters)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses searchJobs internally
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getAllJobs(params?: JobSearchParams): Promise<JobSearchResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[JobService] Using MOCK mode for getAllJobs");
      return this.searchJobs(params || {});
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for getAllJobs");
    // Backend returns: { success: true, data: JobModel[], message: string }
    const response = await apiClient.get<{ success: boolean; data: any[]; message: string }>(
      API_ENDPOINTS.JOBS,
      { params }
    );
    const jobs = response.data.data;
    return {
      jobs: jobs.map((job: any) => ({
        id: job._id || job.id,
        title: job.title,
        company: job.company || { id: "", name: "", logoUrl: "" },
        location: job.location,
        jobType: job.jobType,
        postedDate: job.postedDate,
        industry: job.industry,
        experienceLevel: job.experienceLevel,
        status: job.status,
      })),
      total: jobs.length,
      page: 1,
      limit: jobs.length,
      totalPages: 1,
    };
  },

  /**
   * Get a single job by ID
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses MOCK_JOB_DETAIL or finds in MOCK_JOB_SEARCH_RESULTS
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
      logger.info("[JobService] Using MOCK mode for getJobById");
      await new Promise((resolve) => setTimeout(resolve, 300));

    // Check localStorage for company-created jobs first
    try {
      const companyJobsStored = localStorage.getItem(STORAGE_KEYS.COMPANY_JOBS);
      if (companyJobsStored) {
        const companyJobs = JSON.parse(companyJobsStored) as JobDetailModel[];
        const foundJob = companyJobs.find((j) => j && j.id === id);
        if (foundJob) {
          // Normalize job data to backend-aligned format
          return normalizeJobDetail({
            ...foundJob,
            description:
              foundJob.description || MOCK_JOB_DETAIL.description || "",
            responsibilities:
              foundJob.responsibilities ||
              MOCK_JOB_DETAIL.responsibilities ||
              [],
            qualifications:
              foundJob.qualifications || MOCK_JOB_DETAIL.qualifications || [],
            salaryRange:
              foundJob.salaryRange ||
              MOCK_JOB_DETAIL.salaryRange ||
              "Not specified",
            experienceLevel:
              foundJob.experienceLevel ||
              MOCK_JOB_DETAIL.experienceLevel ||
              "Not specified",
            closingDate:
              foundJob.closingDate ||
              (foundJob as any).applicationDeadline || // Support legacy field name
              (MOCK_JOB_DETAIL as any).applicationDeadline ||
              "",
            company: foundJob.company || MOCK_JOB_DETAIL.company,
          });
        }
      }
    } catch (error) {
      logger.error("Error loading company job from localStorage:", error);
    }

    if (id === MOCK_JOB_DETAIL.id) {
      return normalizeJobDetail(MOCK_JOB_DETAIL);
    }

    const job = MOCK_JOB_SEARCH_RESULTS.find((j) => j.id === id);
    if (job) {
      return normalizeJobDetail({
        ...MOCK_JOB_DETAIL,
        ...job,
        // Ensure arrays are always present (JobSummaryModel doesn't have these properties)
        responsibilities: MOCK_JOB_DETAIL.responsibilities || [],
        qualifications: MOCK_JOB_DETAIL.qualifications || [],
      });
    }

    return normalizeJobDetail(MOCK_JOB_DETAIL);
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for getJobById");
    // Backend returns direct object (not wrapped in success/data)
    // Backend transforms salaryRange string to object and uses closingDate
    const response = await apiClient.get<{
      id: string;
      title: string;
      company: { id: string; name: string; logoUrl: string };
      location: string;
      jobType: string;
      postedDate: string;
      industry?: string;
      experienceLevel?: string;
      description: string;
      responsibilities: string[];
      qualifications: string[];
      salaryRange: { min: number; max: number };
      closingDate: string; // Backend uses closingDate (maps from applicationDeadline)
      postedBy: string | null;
      status: string;
    }>(
      API_ENDPOINTS.JOB_BY_ID(id)
    );
    // Transform backend response to frontend format
    const job = response.data;
    return normalizeJobDetail({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      postedDate: job.postedDate,
      industry: job.industry,
      experienceLevel: job.experienceLevel,
      description: job.description,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      salaryRange: `${job.salaryRange.min}-${job.salaryRange.max}`, // Convert object back to string
      applicationDeadline: job.closingDate, // Backend uses closingDate, frontend uses applicationDeadline
      status: job.status as any,
    });
  },

  /**
   * Get related/similar jobs
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Returns first few jobs excluding current job
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getRelatedJobs(
    jobId: string,
    limit: number = 3
  ): Promise<JobSummaryModel[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[JobService] Using MOCK mode for getRelatedJobs");
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Mock: Return first few jobs excluding current job
      const allJobs = [...MOCK_JOB_SEARCH_RESULTS];
      return allJobs
        .filter((job) => job.id !== jobId)
        .slice(0, limit) as JobSummaryModel[];
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for getRelatedJobs");
    // Backend getRelatedJobs is not implemented (returns 501)
    // Fallback to search for similar jobs
    try {
      const response = await apiClient.get<JobSummaryModel[]>(
        `${API_ENDPOINTS.JOB_BY_ID(jobId)}/related`,
        { params: { limit } }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 501) {
        // Backend not implemented - return empty array
        logger.warn("[JobService] getRelatedJobs not implemented in backend");
        return [];
      }
      throw error;
    }
  },

  /**
   * Apply for a job
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Saves to localStorage (userApplications and companyApplications)
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async applyForJob(data: JobApplicationData): Promise<JobApplicationResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[JobService] Using MOCK mode for applyForJob");
      await new Promise((resolve) => setTimeout(resolve, 500));

    const applicationId = `app_${Date.now()}`;
    const appliedDate = new Date().toISOString().split("T")[0];

    try {
      const job = await jobService.getJobById(data.jobId);

      // Save to userApplications (for user dashboard)
      const userStored =
        localStorage.getItem(STORAGE_KEYS.USER_APPLICATIONS) || "[]";
      const userApplications = JSON.parse(userStored) as UserApplicationModel[];

      const userApplication: UserApplicationModel = {
        id: applicationId,
        jobId: data.jobId,
        appliedDate: appliedDate,
        status: "Pending" as const, // ✅ Backend uses capitalized status
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          postedDate: job.postedDate,
          experienceLevel: job.experienceLevel,
        },
      };
      userApplications.push(userApplication);
      localStorage.setItem(
        STORAGE_KEYS.USER_APPLICATIONS,
        JSON.stringify(userApplications)
      );

      // Save to companyApplications (for company dashboard)
      const companyStored =
        localStorage.getItem(STORAGE_KEYS.COMPANY_APPLICATIONS) || "[]";
      const companyApplications = JSON.parse(
        companyStored
      ) as ApplicationModel[];
      // Get logged-in user ID for application reference
      let userId = "";
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (storedUser) {
          const user: { id: string } = JSON.parse(storedUser);
          userId = user.id || "";
        }
      } catch (error) {
        logger.error("Error getting user ID for application:", error);
      }

      const companyApplication: ApplicationModel = {
        id: applicationId,
        job: data.jobId, // ✅ Backend uses "job" not "jobPost"
        applicant: userId, // ✅ Backend uses "applicant" not "user"
        appliedAt: appliedDate, // ✅ Backend uses "appliedAt" not "date"
        cvFilePath: data.resumeFile
          ? URL.createObjectURL(data.resumeFile)
          : "", // ✅ Backend uses "cvFilePath" not "cvUrl"
        status: "Pending" as const, // ✅ Backend uses capitalized status
        // Denormalized fields for UI convenience (not in backend model)
        jobTitle: job.title,
        candidateName: data.fullName,
        candidateEmail: data.email,
        candidatePhone: data.phone,
        candidateLocation: data.location || "Not specified",
        experienceLevel: job.experienceLevel,
      };
      companyApplications.push(companyApplication);
      localStorage.setItem(
        STORAGE_KEYS.COMPANY_APPLICATIONS,
        JSON.stringify(companyApplications)
      );
    } catch (error) {
      logger.error("Error saving application:", error);
      throw error;
    }

    return {
      applicationId,
      message: "Application submitted successfully",
      status: "success",
    };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for applyForJob");
    // Backend expects: applicantId (from auth), cv file, coverLetter file (optional)
    // Get applicantId from auth token (stored in localStorage)
    let applicantId = "";
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string } = JSON.parse(storedUser);
        applicantId = user.id || "";
      }
    } catch (error) {
      logger.error("Error getting applicantId:", error);
      throw new Error("User not authenticated");
    }

    if (!applicantId) {
      throw new Error("User not authenticated");
    }

    const formData = new FormData();
    formData.append("applicantId", applicantId); // Backend expects applicantId
    if (data.resumeFile) {
      formData.append("cv", data.resumeFile); // Backend expects "cv" not "resume"
    }
    if (data.coverLetter) {
      formData.append("coverLetter", data.coverLetter); // Backend expects coverLetter file
    }

    // Backend returns: { success: true, application: ApplicationModel }
    const response = await apiClient.post<{ success: boolean; application: any }>(
      API_ENDPOINTS.JOB_APPLY(data.jobId),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    
    return {
      applicationId: response.data.application._id || response.data.application.id,
      message: "Application submitted successfully",
      status: "success" as const,
    };
  },

  /**
   * Get filter options (locations, industries, etc.)
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Extracts unique values from mock data
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[JobService] Using MOCK mode for getFilterOptions");
      await new Promise((resolve) => setTimeout(resolve, 200));
    // Extract unique values from mock data
    const locations = Array.from(
      new Set(MOCK_JOB_SEARCH_RESULTS.map((job) => job.location))
    ).filter((loc): loc is string => typeof loc === "string");
    const industries = Array.from(
      new Set(
        MOCK_JOB_SEARCH_RESULTS.map((job) => job.industry).filter(
          (ind): ind is string => Boolean(ind)
        )
      )
    );
    const experienceLevels = Array.from(
      new Set(
        MOCK_JOB_SEARCH_RESULTS.map((job) => job.experienceLevel).filter(
          (level): level is string => Boolean(level)
        )
      )
    );
    const jobTypes = Array.from(
      new Set(MOCK_JOB_SEARCH_RESULTS.map((job) => job.jobType))
    ).filter((type): type is string => typeof type === "string");

    return {
      locations,
      industries,
      experienceLevels,
      jobTypes,
    };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[JobService] Using BACKEND mode for getFilterOptions");
    const response = await apiClient.get<FilterOptionsResponse>(
      API_ENDPOINTS.JOBS + "/filters"
    );
    return response.data;
  },
};

export default jobService;
