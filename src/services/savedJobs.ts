/**
 * SavedJobs Service - API calls for saved job operations
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
import { logger } from "@/lib/logger";
import type { SavedJobModel, SavedJobInputModel } from "@/models/savedJobs";
import type { JobSummaryModel } from "@/models/jobPosts";

// ============================================================================
// SAVED JOBS SERVICE - MOCK/BACKEND MODE
// ============================================================================

export const savedJobsService = {
  /**
   * Save a job for the authenticated user
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Saves job ID to localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async saveJob(jobId: string): Promise<SavedJobModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[SavedJobsService] Using MOCK mode for saveJob");
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
        const jobIds: string[] = stored ? JSON.parse(stored) : [];
        if (!jobIds.includes(jobId)) {
          jobIds.push(jobId);
          localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(jobIds));
        }
        
        // Get user ID from auth
        let userId = "";
        try {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (storedUser) {
            const user: { id: string } = JSON.parse(storedUser);
            userId = user.id || "";
          }
        } catch (error) {
          logger.error("Error getting user ID:", error);
        }
        
        return {
          id: `saved_${Date.now()}`,
          user: userId,
          job: jobId,
          savedAt: new Date().toISOString(),
        };
      } catch (error) {
        logger.error("Error saving job:", error);
        throw error;
      }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[SavedJobsService] Using BACKEND mode for saveJob");
    // Backend endpoint: POST /api/savedJobs
    // Backend expects: { jobId: string }
    // Backend returns: SavedJobModel directly (not wrapped)
    const response = await apiClient.post<SavedJobModel>(
      "/savedJobs",
      { jobId }
    );
    return response.data;
  },

  /**
   * Get all saved jobs for the authenticated user
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Loads job IDs from localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getSavedJobs(): Promise<SavedJobModel[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[SavedJobsService] Using MOCK mode for getSavedJobs");
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
        const jobIds: string[] = stored ? JSON.parse(stored) : [];
        
        // Get user ID from auth
        let userId = "";
        try {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (storedUser) {
            const user: { id: string } = JSON.parse(storedUser);
            userId = user.id || "";
          }
        } catch (error) {
          logger.error("Error getting user ID:", error);
        }
        
        return jobIds.map((jobId, index) => ({
          id: `saved_${index}`,
          user: userId,
          job: jobId,
          savedAt: new Date().toISOString(),
        }));
      } catch (error) {
        logger.error("Error loading saved jobs:", error);
        return [];
      }
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[SavedJobsService] Using BACKEND mode for getSavedJobs");
    // Backend endpoint: GET /api/savedJobs
    // Backend returns: SavedJobModel[] with populated job (not wrapped)
    const response = await apiClient.get<SavedJobModel[]>(
      "/savedJobs"
    );
    return response.data;
  },

  /**
   * Remove a saved job
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Removes job ID from localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async removeSavedJob(savedJobId: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[SavedJobsService] Using MOCK mode for removeSavedJob");
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      try {
        // Extract jobId from savedJobId if needed
        const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
        if (stored) {
          const jobIds: string[] = JSON.parse(stored);
          // Try to find and remove by savedJobId pattern or by index
          const updated = jobIds.filter((_, index) => `saved_${index}` !== savedJobId);
          localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
        }
      } catch (error) {
        logger.error("Error removing saved job:", error);
        throw error;
      }
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[SavedJobsService] Using BACKEND mode for removeSavedJob");
    // Backend endpoint: DELETE /api/savedJobs/:id
    // Backend returns: { message: string }
    await apiClient.delete(`/savedJobs/${savedJobId}`);
  },
};

export default savedJobsService;
