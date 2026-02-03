/**
 * Job Service - API calls for job-related operations
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
  MOCK_JOB_SEARCH_RESULTS,
  MOCK_JOB_DETAIL,
  MOCK_JOB_SEARCH_HERO,
} from "@/mocks";
import { logger } from "@/lib/logger";
import type { JobSummaryModel, JobDetailModel } from "@/models/job";
import type { UserApplicationModel } from "@/models/user-applications";
import type { ApplicationModel } from "@/models/application";
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
// JOB SERVICE - MOCK DATA (CURRENT MODE)
// ============================================================================

export const jobService = {
  /**
   * Search for jobs with filters and pagination
   *
   * MOCK: Uses MOCK_JOB_SEARCH_RESULTS + localStorage company jobs
   * BACKEND: Will use GET /jobs/search with query params
   */
  async searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobSearchResponse>(
    //   API_ENDPOINTS.JOB_SEARCH,
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get all jobs (with optional filters)
   *
   * MOCK: Uses searchJobs internally
   * BACKEND: Will use GET /jobs
   */
  async getAllJobs(params?: JobSearchParams): Promise<JobSearchResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobSearchResponse>(
    //   API_ENDPOINTS.JOBS,
    //   { params }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    return this.searchJobs(params || {});
  },

  /**
   * Get a single job by ID
   *
   * MOCK: Uses MOCK_JOB_DETAIL or finds in MOCK_JOB_SEARCH_RESULTS
   * BACKEND: Will use GET /jobs/:id
   */
  async getJobById(id: string): Promise<JobDetailModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobDetailModel>(
    //   API_ENDPOINTS.JOB_BY_ID(id)
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },

  /**
   * Get related/similar jobs
   *
   * MOCK: Returns empty array (not implemented in mock)
   * BACKEND: Will use GET /jobs/:id/related
   */
  async getRelatedJobs(
    jobId: string,
    limit: number = 3
  ): Promise<JobSummaryModel[]> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobSummaryModel[]>(
    //   `${API_ENDPOINTS.JOB_BY_ID(jobId)}/related`,
    //   { params: { limit } }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Mock: Return first few jobs excluding current job
    const allJobs = [...MOCK_JOB_SEARCH_RESULTS];
    return allJobs
      .filter((job) => job.id !== jobId)
      .slice(0, limit) as JobSummaryModel[];
  },

  /**
   * Apply for a job
   *
   * MOCK: Saves to localStorage (userApplications and companyApplications)
   * BACKEND: Will use POST /jobs/:id/apply with FormData
   */
  async applyForJob(data: JobApplicationData): Promise<JobApplicationResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const formData = new FormData();
    // formData.append("fullName", data.fullName);
    // formData.append("email", data.email);
    // formData.append("phone", data.phone);
    // formData.append("coverLetter", data.coverLetter);
    // if (data.resumeFile) {
    //   formData.append("resume", data.resumeFile);
    // }
    // if (data.location) {
    //   formData.append("location", data.location);
    // }
    // if (data.linkedInUrl) {
    //   formData.append("linkedInUrl", data.linkedInUrl);
    // }
    // if (data.portfolioUrl) {
    //   formData.append("portfolioUrl", data.portfolioUrl);
    // }
    //
    // const response = await apiClient.post<JobApplicationResponse>(
    //   API_ENDPOINTS.JOB_APPLY(data.jobId),
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
        status: "pending" as const,
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
        jobPost: data.jobId, // ✅ Renamed from jobId (backend aligned)
        user: userId, // ✅ Added: User reference (backend aligned)
        date: appliedDate, // ✅ Renamed from appliedDate (backend aligned)
        status: "pending" as const,
        // Denormalized fields for UI convenience
        jobTitle: job.title,
        candidateName: data.fullName,
        candidateEmail: data.email,
        candidatePhone: data.phone,
        candidateLocation: data.location || "Not specified",
        cvUrl: data.resumeFile
          ? URL.createObjectURL(data.resumeFile)
          : undefined,
        coverLetter: data.coverLetter || undefined,
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
  },

  /**
   * Get filter options (locations, industries, etc.)
   *
   * MOCK: Returns empty arrays (should be fetched from backend)
   * BACKEND: Will use GET /jobs/filters
   */
  async getFilterOptions(): Promise<FilterOptionsResponse> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<FilterOptionsResponse>(
    //   API_ENDPOINTS.JOBS + "/filters"
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
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
  },
};

export default jobService;
