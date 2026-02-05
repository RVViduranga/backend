/**
 * Custom hook for job post review functionality
 * Handles data loading, transformation, and publishing
 *
 * Architecture: Hook → Service → API/Mock
 * - No navigation logic (component handles navigation)
 * - Uses utility functions for data transformation and storage
 */
import { useState, useEffect, useCallback } from "react";
import { useCompany } from "@/hooks/use-company-context";
import { useAuth } from "@/hooks/use-auth-context";
import companyService from "@/services/company";
import type { JobDetailModel, JobPostInputModel } from "@/models/jobPosts";
import { logger } from "@/lib/logger";
import { transformFormDataToJobDetail } from "@/utils/jobTransform";
import {
  getJobPostFormData,
  getJobPostId,
  saveJobPostId,
  clearJobPostData,
} from "@/utils/jobPostStorage";

interface UseJobPostReviewReturn {
  jobData: JobDetailModel | null;
  isLoading: boolean;
  isPublishing: boolean;
  error: string | null;
  loadJobFromAPI: (jobId: string) => Promise<void>;
  loadJobFromSession: () => void;
  publishJob: () => Promise<{
    success: boolean;
    jobId?: string;
    error?: string;
  }>;
  clearData: () => void;
}

export function useJobPostReview(): UseJobPostReviewReturn {
  const { profile } = useCompany();
  const { user } = useAuth();
  const [jobData, setJobData] = useState<JobDetailModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load job data from sessionStorage (form data)
   */
  const loadJobFromSession = useCallback(() => {
    try {
      const formData = getJobPostFormData();
      if (formData) {
        const jobId = getJobPostId() || "draft";
        const transformedData = transformFormDataToJobDetail(
          formData,
          jobId,
          profile
            ? {
                id: profile.id,
                name: profile.name,
                logoUrl: profile.logoUrl,
              }
            : null,
          user?.id // ✅ Set postedBy from auth context
        );
        setJobData(transformedData);
        setError(null);
      } else {
        setJobData(null);
        setError("No job data found in session");
      }
    } catch (error) {
      logger.error("Error loading job from session:", error);
      setError("Failed to load job data");
      setJobData(null);
    }
  }, [profile]);

  /**
   * Load job data from API by ID
   */
  const loadJobFromAPI = useCallback(
    async (jobId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const job = await companyService.getJobById(jobId);
        setJobData(job);
      } catch (error) {
        logger.error("Error loading job from API:", error);
        setError("Failed to load job details");
        loadJobFromSession();
      } finally {
        setIsLoading(false);
      }
    },
    [loadJobFromSession]
  );

  /**
   * Clear session storage data
   */
  const clearData = useCallback(() => {
    clearJobPostData();
  }, []);

  /**
   * Publish job posting
   * Returns success status instead of navigating
   */
  const publishJob = useCallback(async (): Promise<{
    success: boolean;
    jobId?: string;
    error?: string;
  }> => {
    if (!jobData) {
      return { success: false, error: "No job data available" };
    }

    setIsPublishing(true);
    setError(null);

    try {
      const jobId = getJobPostId();

      if (jobId) {
        await companyService.updateJob(jobId, { status: "Active" });
        clearData();
        return { success: true, jobId };
      } else {
        const formData = getJobPostFormData();
        if (formData) {
          // Transform form data to JobDetailModel format (backend-aligned)
          const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          const transformedJob = transformFormDataToJobDetail(
            formData,
            jobId,
            profile
              ? {
                  id: profile.id,
                  name: profile.name,
                  logoUrl: profile.logoUrl,
                }
              : null,
            user?.id // ✅ Set postedBy from auth context
          );
          
          // Create job with transformed data
          const response = await companyService.createJob(transformedJob);
          saveJobPostId(response.id);
          clearData();
          return { success: true, jobId: response.id };
        } else {
          return { success: false, error: "No form data available" };
        }
      }
    } catch (error) {
      logger.error("Error publishing job:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to publish job. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsPublishing(false);
    }
  }, [jobData, clearData]);

  /**
   * Initial data load
   */
  useEffect(() => {
    const jobId = getJobPostId();

    if (jobId) {
      loadJobFromAPI(jobId);
    } else {
      loadJobFromSession();
      setIsLoading(false);
    }
  }, [loadJobFromAPI, loadJobFromSession]);

  return {
    jobData,
    isLoading,
    isPublishing,
    error,
    loadJobFromAPI,
    loadJobFromSession,
    publishJob,
    clearData,
  };
}


