/**
 * User Service - API calls for user-related operations
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
import { API_ENDPOINTS, STORAGE_KEYS, DEFAULT_JOB_TYPE } from "@/constants";
import {
  MOCK_USER_PROFILE,
  MOCK_USER_PROFILES,
  MOCK_USER_CVS,
  MOCK_USER_CVS_MAP,
  MOCK_MEDIA_FILES,
  MOCK_MEDIA_FILES_MAP,
  MOCK_USER_APPLICATIONS,
  MOCK_USER_APPLICATIONS_MAP,
  MOCK_JOB_POSTS_MANAGE,
  MOCK_JOB_SEARCH_RESULTS,
} from "@/mocks";
import { logger } from "@/lib/logger";
import type { UserProfileModel, UserProfileViewModel } from "@/models/user-profile";
import type { UserApplicationModel } from "@/models/user-applications";
import type { JobSummaryModel } from "@/models/job";
import type { UserModel } from "@/models/user";
import type { ProfileModel } from "@/models/user-profile";
import { transformBackendModelsToViewModel, normalizeUserData, normalizeProfileData } from "@/lib/transformers/user-transformers";
import { 
  calculateExperienceYears, 
  calculateQualificationScore, 
  calculateSkillScore,
  splitFullName 
} from "@/utils/profile-calculations";

// ============================================================================
// TYPE DEFINITIONS - API Request/Response Types
// ============================================================================

export interface UserCV {
  id: string;
  name: string;
  fileName: string;
  uploadedDate: string;
  fileSize: string;
  isPrimary: boolean;
  format: string;
  downloadUrl: string;
}

export interface PortfolioItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
}

// ============================================================================
// USER SERVICE - MOCK DATA (CURRENT MODE)
// ============================================================================

export const userService = {
  /**
   * Get user profile (Backend-Aligned)
   * Returns UserModel + ProfileModel separately
   *
   * MOCK: Uses logged-in user ID from localStorage to get correct user profile
   * BACKEND: Will use GET /users/profile and GET /users/profile/details
   */
  async getUser(): Promise<UserModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<UserModel>(
    //   API_ENDPOINTS.USER_PROFILE
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get logged-in user ID from localStorage (stored by AuthContext)
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "user" && user.id) {
          const userId = user.id;
          const legacyProfile = MOCK_USER_PROFILES[userId];
          if (legacyProfile) {
            return normalizeUserData(legacyProfile);
          }
        }
      }
    } catch (error) {
      logger.error("Error getting logged-in user ID:", error);
    }

    // Fallback to default if user ID not found
    return normalizeUserData(MOCK_USER_PROFILE);
  },

  /**
   * Get user profile (Legacy - Deprecated)
   * @deprecated Use getUser() + getProfile() instead, or use getProfileViewModel() for UI
   * Kept for backward compatibility during migration
   */
  async getProfile(): Promise<UserProfileModel> {
    const user = await this.getUser();
    const profile = await this.getProfileData(user.id);
    
    // Transform to legacy format for backward compatibility
    return {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      phone: user.phone,
      headline: "",
      location: user.location,
      avatarUrl: "",
      cvUploaded: !!profile?.cv,
      education: [],
      experience: [],
    } as UserProfileModel;
  },

  /**
   * Get profile data (Backend-Aligned)
   * Returns ProfileModel separately from UserModel
   */
  async getProfileData(userId: string): Promise<ProfileModel | undefined> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<ProfileModel>(
    //   API_ENDPOINTS.USER_PROFILE_DETAILS
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const legacyProfile = MOCK_USER_PROFILES[userId];
      if (legacyProfile) {
        return normalizeProfileData(legacyProfile, userId);
      }
    } catch (error) {
      logger.error("Error getting profile data:", error);
    }

    return undefined;
  },

  /**
   * Get user profile view model (UI Convenience)
   * Combines UserModel + ProfileModel into UserProfileViewModel
   */
  async getProfileViewModel(): Promise<UserProfileViewModel> {
    const user = await this.getUser();
    const profile = await this.getProfileData(user.id);
    
    // Get education and experience from legacy profile if available
    const legacyProfile = MOCK_USER_PROFILES[user.id];
    const education = legacyProfile?.education || [];
    const experienceHistory = legacyProfile?.experience || [];
    
    return transformBackendModelsToViewModel(user, profile, education, experienceHistory);
  },

  /**
   * Update user record (Backend-Aligned)
   * Updates the users collection
   */
  async updateUser(
    userId: string,
    updates: Partial<UserModel>
  ): Promise<UserModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.patch<UserModel>(
    //   API_ENDPOINTS.USER_PROFILE,
    //   updates
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Get current user data
    const currentUser = await this.getUser();
    const updatedUser = { ...currentUser, ...updates };
    
    // Store updated user data (mock: store in localStorage)
    try {
      localStorage.setItem(`user_data_${userId}`, JSON.stringify(updatedUser));
    } catch (error) {
      logger.error("Error storing user data:", error);
    }
    
    return updatedUser;
  },

  /**
   * Update profile record (Backend-Aligned)
   * Updates the profiles collection
   */
  async updateProfileData(
    userId: string,
    updates: Partial<ProfileModel>
  ): Promise<ProfileModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.patch<ProfileModel>(
    //   API_ENDPOINTS.USER_PROFILE_DETAILS,
    //   updates
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Get current profile data
    const currentProfile = await this.getProfileData(userId);
    const updatedProfile: ProfileModel = {
      id: currentProfile?.id || `profile_${userId}`,
      user: userId,
      cv: updates.cv !== undefined ? updates.cv : currentProfile?.cv,
      experience: updates.experience !== undefined ? updates.experience : (currentProfile?.experience || 0),
      qualification: updates.qualification !== undefined ? updates.qualification : (currentProfile?.qualification || 0),
      skill: updates.skill !== undefined ? updates.skill : (currentProfile?.skill || 0),
      matchingData: updates.matchingData !== undefined ? updates.matchingData : currentProfile?.matchingData,
    };
    
    // Store updated profile data (mock: store in localStorage)
    try {
      localStorage.setItem(`user_profile_${userId}`, JSON.stringify(updatedProfile));
    } catch (error) {
      logger.error("Error storing profile data:", error);
    }
    
    return updatedProfile;
  },

  /**
   * Update user profile (Legacy - Deprecated)
   * @deprecated Use getUser() + getProfile() instead, or use getProfileViewModel() for UI
   * Kept for backward compatibility during migration
   * 
   * This method now transforms legacy UserProfileModel to backend-aligned format:
   * - Splits fullName into firstName + lastName
   * - Calculates experience (number) from experience array
   * - Calculates qualification (number) from education array
   * - Calculates skill (number) from experience + education
   * - Updates both user and profile records
   */
  async updateProfile(
    updates: Partial<UserProfileModel>
  ): Promise<UserProfileModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // Transform updates to backend format
    // const userUpdates: Partial<UserModel> = {};
    // const profileUpdates: Partial<ProfileModel> = {};
    // 
    // if (updates.fullName) {
    //   const { firstName, lastName } = splitFullName(updates.fullName);
    //   userUpdates.firstName = firstName;
    //   userUpdates.lastName = lastName;
    // }
    // if (updates.email) userUpdates.email = updates.email;
    // if (updates.phone) userUpdates.phone = updates.phone;
    // if (updates.location) userUpdates.location = updates.location;
    // 
    // if (updates.experience) {
    //   profileUpdates.experience = calculateExperienceYears(updates.experience);
    // }
    // if (updates.education) {
    //   profileUpdates.qualification = calculateQualificationScore(updates.education);
    // }
    // if (updates.experience || updates.education) {
    //   profileUpdates.skill = calculateSkillScore(
    //     updates.experience || [],
    //     updates.education || []
    //   );
    // }
    // 
    // // Update user and profile separately
    // const userId = updates.id || (await this.getUser()).id;
    // await Promise.all([
    //   apiClient.patch(API_ENDPOINTS.USER_PROFILE, userUpdates),
    //   apiClient.patch(API_ENDPOINTS.USER_PROFILE_DETAILS, profileUpdates),
    // ]);
    // 
    // // Return legacy format for backward compatibility
    // return await this.getProfile();

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Get current user ID
    let userId: string;
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string } = JSON.parse(storedUser);
        userId = user.id;
      } else {
        userId = updates.id || "";
      }
    } catch (error) {
      logger.error("Error getting user ID:", error);
      userId = updates.id || "";
    }

    if (!userId) {
      throw new Error("User ID not found");
    }

    // Transform updates to backend format
    const userUpdates: Partial<UserModel> = {};
    const profileUpdates: Partial<ProfileModel> = {};

    // Handle fullName → firstName + lastName
    if (updates.fullName) {
      const { firstName, lastName } = splitFullName(updates.fullName);
      userUpdates.firstName = firstName;
      userUpdates.lastName = lastName;
    }

    // Handle user fields
    if (updates.email) userUpdates.email = updates.email;
    if (updates.phone) userUpdates.phone = updates.phone;
    if (updates.location) userUpdates.location = updates.location;

    // Handle profile fields - calculate numeric values from arrays
    if (updates.experience && Array.isArray(updates.experience)) {
      profileUpdates.experience = calculateExperienceYears(updates.experience);
    }
    if (updates.education && Array.isArray(updates.education)) {
      profileUpdates.qualification = calculateQualificationScore(updates.education);
    }
    if ((updates.experience && Array.isArray(updates.experience)) || 
        (updates.education && Array.isArray(updates.education))) {
      profileUpdates.skill = calculateSkillScore(
        updates.experience || [],
        updates.education || []
      );
    }

    // Update user and profile records separately
    if (Object.keys(userUpdates).length > 0) {
      await this.updateUser(userId, userUpdates);
    }
    if (Object.keys(profileUpdates).length > 0) {
      await this.updateProfileData(userId, profileUpdates);
    }

    // Store education and experience arrays separately for UI display (mock)
    if (updates.education || updates.experience) {
      try {
        const educationData = updates.education || [];
        const experienceData = updates.experience || [];
        localStorage.setItem(`user_education_${userId}`, JSON.stringify(educationData));
        localStorage.setItem(`user_experience_${userId}`, JSON.stringify(experienceData));
      } catch (error) {
        logger.error("Error storing education/experience arrays:", error);
      }
    }

    // Return legacy format for backward compatibility
    return { ...MOCK_USER_PROFILE, ...updates } as UserProfileModel;
  },

  /**
   * Get user's saved jobs
   *
   * MOCK: Loads job IDs from localStorage and matches with mock job data
   * BACKEND: Will use GET /users/saved-jobs
   */
  async getSavedJobs(): Promise<JobSummaryModel[]> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<JobSummaryModel[]>(
    //   API_ENDPOINTS.USER_SAVED_JOBS
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      if (stored) {
        const jobIds: string[] = JSON.parse(stored);
        if (jobIds.length === 0) {
          return [];
        }

        // Get all available jobs: mock jobs + company-created jobs from localStorage
        // Convert JobSummary[] to JobSummaryModel[] for type consistency
        const allMockJobs: JobSummaryModel[] = [
          ...(MOCK_JOB_POSTS_MANAGE as unknown as JobSummaryModel[]),
          ...(MOCK_JOB_SEARCH_RESULTS as unknown as JobSummaryModel[]),
        ].filter((job) => job && job.id && job.company && job.company.name);

        // Get company-created jobs from localStorage
        let companyJobs: JobSummaryModel[] = [];
        try {
          const companyJobsStored = localStorage.getItem(
            STORAGE_KEYS.COMPANY_JOBS
          );
          if (companyJobsStored) {
            const parsed = JSON.parse(companyJobsStored) as JobSummaryModel[];
            // Filter to only include jobs with proper structure (has company property)
            companyJobs = (parsed || []).filter(
              (job) => job && job.id && job.company && job.company.name
            );
          }
        } catch (error) {
          logger.error("Error loading company jobs for saved jobs:", error);
        }

        // Combine all jobs and remove duplicates
        const allJobs: JobSummaryModel[] = [
          ...(allMockJobs || []),
          ...(companyJobs || []),
        ];
        const uniqueJobs = (allJobs || []).filter(
          (job, index, self) =>
            job &&
            job.id &&
            index === self.findIndex((j) => j && j.id === job.id)
        );

        // Filter to only saved job IDs and ensure all have proper structure
        const savedJobs: JobSummaryModel[] = (uniqueJobs || [])
          .filter((job) => job && job.id && jobIds.includes(job.id))
          .filter((job) => job.company && job.company.name) // Ensure company exists
          .map((job) => ({
            ...job,
            // Ensure all required fields exist with defaults
            id: job.id || `job_${Date.now()}`,
            title: job.title || "Untitled Job",
            company: job.company || {
              id: "unknown",
              name: "Unknown Company",
              logoUrl: "",
            },
            location: job.location || "Location not specified",
            jobType: job.jobType || DEFAULT_JOB_TYPE,
            postedDate:
              job.postedDate || new Date().toISOString().split("T")[0],
          })) as JobSummaryModel[];

        return savedJobs || [];
      }
      return [];
    } catch (error) {
      logger.error("Error loading saved jobs:", error);
      return [];
    }
  },

  /**
   * Save a job
   *
   * MOCK: Saves job ID to localStorage
   * BACKEND: Will use POST /jobs/:id/save
   */
  async saveJob(jobId: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.post(API_ENDPOINTS.JOB_SAVE(jobId));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      const jobIds: string[] = stored ? JSON.parse(stored) : [];
      if (!jobIds.includes(jobId)) {
        jobIds.push(jobId);
        localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(jobIds));
      }
    } catch (error) {
      logger.error("Error saving job:", error);
      throw error;
    }
  },

  /**
   * Unsave a job
   *
   * MOCK: Removes job ID from localStorage
   * BACKEND: Will use DELETE /jobs/:id/unsave
   */
  async unsaveJob(jobId: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.delete(API_ENDPOINTS.JOB_UNSAVE(jobId));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 200));
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      if (stored) {
        const jobIds: string[] = JSON.parse(stored);
        const updated = jobIds.filter((id) => id !== jobId);
        localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(updated));
      }
    } catch (error) {
      logger.error("Error unsaving job:", error);
      throw error;
    }
  },

  /**
   * Get user's job applications
   *
   * MOCK: Uses logged-in user ID to get correct applications, or loads from localStorage
   * BACKEND: Will use GET /users/applications
   */
  async getApplications(): Promise<UserApplicationModel[]> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<UserApplicationModel[]>(
    //   API_ENDPOINTS.USER_APPLICATIONS
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check localStorage first (for newly submitted applications)
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_APPLICATIONS);
      if (stored) {
        const savedApps = JSON.parse(stored) as UserApplicationModel[];
        if (savedApps && savedApps.length > 0) {
          return savedApps;
        }
      }
    } catch (error) {
      logger.error("Error loading saved applications:", error);
    }

    // Get logged-in user ID from localStorage to fetch user-specific applications
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "user" && user.id) {
          const userId = user.id;
          const userApplications = MOCK_USER_APPLICATIONS_MAP[userId];
          if (userApplications) {
            return userApplications as UserApplicationModel[];
          }
        }
      }
    } catch (error) {
      logger.error("Error getting logged-in user ID for applications:", error);
    }

    // Fallback to default if user ID not found
    return MOCK_USER_APPLICATIONS as UserApplicationModel[];
  },

  /**
   * Get a single application by ID
   *
   * MOCK: Searches through user's applications
   * BACKEND: Will use GET /users/applications/:id
   */
  async getApplicationById(id: string): Promise<UserApplicationModel> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<UserApplicationModel>(
    //   API_ENDPOINTS.USER_APPLICATION_BY_ID(id)
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const apps = await this.getApplications();
      const app = apps.find((a) => a.id === id);
      if (app) return app;
      throw new Error("Application not found");
    } catch (error) {
      logger.error("Error loading application:", error);
      throw error;
    }
  },

  /**
   * Upload CV
   *
   * MOCK: Creates mock CV entry and adds to localStorage
   * BACKEND: POST /users/cv/upload with FormData
   */
  async uploadCV(file: File, name: string): Promise<UserCV> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("name", name);
    // const response = await apiClient.post<UserCV>(
    //   API_ENDPOINTS.USER_CV_UPLOAD,
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
    const newCV: UserCV = {
      id: `cv_${Date.now()}`,
      name,
      fileName: file.name,
      uploadedDate: new Date().toISOString(),
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      isPrimary: false,
      format: file.name.split(".").pop()?.toUpperCase() || "PDF",
      downloadUrl: URL.createObjectURL(file),
    };

    // Add to mock CVs (simulate saving to backend)
    try {
      const currentCVs = await this.getCVs();
      const updatedCVs = [...currentCVs, newCV];
      // Store in localStorage for mock persistence
      localStorage.setItem(STORAGE_KEYS.USER_CVS, JSON.stringify(updatedCVs));
    } catch (error) {
      logger.error("Error saving CV:", error);
    }

    return newCV;
  },

  /**
   * Get user's CVs
   *
   * MOCK: Checks localStorage first, then falls back to MOCK_USER_CVS
   * BACKEND: Will use GET /users/cv
   */
  async getCVs(): Promise<UserCV[]> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<UserCV[]>(API_ENDPOINTS.USER_CV);
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check localStorage first (for uploaded CVs)
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_CVS);
      if (stored) {
        const savedCVs = JSON.parse(stored) as UserCV[];
        if (savedCVs && savedCVs.length > 0) {
          return savedCVs;
        }
      }
    } catch (error) {
      logger.error("Error loading saved CVs:", error);
    }

    // Get logged-in user ID to fetch user-specific CVs
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "user" && user.id) {
          const userId = user.id;
          const userCVs = MOCK_USER_CVS_MAP[userId];
          if (userCVs && userCVs.length > 0) {
            return userCVs.map((cv) => ({
              id: cv.id,
              name: cv.name,
              fileName: cv.name,
              uploadedDate: cv.dateUploaded,
              fileSize: `${cv.sizeMB} MB`,
              isPrimary: cv.isPrimary,
              format: cv.name.split(".").pop()?.toUpperCase() || "PDF",
              downloadUrl: cv.downloadUrl,
            }));
          }
        }
      }
    } catch (error) {
      logger.error("Error getting logged-in user ID for CVs:", error);
    }

    // Fallback to default mock CVs
    return MOCK_USER_CVS.map((cv) => ({
      id: cv.id,
      name: cv.name,
      fileName: cv.name,
      uploadedDate: cv.dateUploaded,
      fileSize: `${cv.sizeMB} MB`,
      isPrimary: cv.isPrimary,
      format: cv.name.split(".").pop()?.toUpperCase() || "PDF",
      downloadUrl: cv.downloadUrl,
    }));
  },

  /**
   * Delete a CV
   *
   * MOCK: Removes from localStorage
   * BACKEND: DELETE /users/cv/:id
   */
  async deleteCV(id: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.delete(API_ENDPOINTS.USER_CV_BY_ID(id));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const currentCVs = await this.getCVs();
      const updatedCVs = currentCVs.filter((cv) => cv.id !== id);
      localStorage.setItem(STORAGE_KEYS.USER_CVS, JSON.stringify(updatedCVs));
    } catch (error) {
      logger.error("Error deleting CV:", error);
      throw error;
    }
  },

  /**
   * Set primary CV
   *
   * MOCK: Updates localStorage to mark CV as primary
   * BACKEND: POST /users/cv/:id/primary
   */
  async setPrimaryCV(id: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.post(API_ENDPOINTS.USER_CV_PRIMARY(id));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const currentCVs = await this.getCVs();
      const updatedCVs = currentCVs.map((cv) => ({
        ...cv,
        isPrimary: cv.id === id,
      }));
      localStorage.setItem(STORAGE_KEYS.USER_CVS, JSON.stringify(updatedCVs));
    } catch (error) {
      logger.error("Error setting primary CV:", error);
      throw error;
    }
  },

  /**
   * Upload portfolio item
   *
   * MOCK: Creates mock portfolio entry and adds to localStorage
   * BACKEND: POST /users/portfolio/upload with FormData
   */
  async uploadPortfolio(
    file: File,
    name: string,
    type: string
  ): Promise<PortfolioItem> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append("name", name);
    // formData.append("type", type);
    // const response = await apiClient.post<PortfolioItem>(
    //   API_ENDPOINTS.USER_PORTFOLIO_UPLOAD,
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
    const newItem: PortfolioItem = {
      id: `portfolio_${Date.now()}`,
      name,
      type,
      uploadDate: new Date().toISOString(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      url: URL.createObjectURL(file),
    };

    // Add to mock portfolio (simulate saving to backend)
    try {
      const currentPortfolio = await this.getPortfolio();
      const updatedPortfolio = [...currentPortfolio, newItem];
      // Store in localStorage for mock persistence
      localStorage.setItem(
        STORAGE_KEYS.USER_PORTFOLIO,
        JSON.stringify(updatedPortfolio)
      );
    } catch (error) {
      logger.error("Error saving portfolio item:", error);
    }

    return newItem;
  },

  /**
   * Get user's portfolio items
   *
   * MOCK: Checks localStorage first, then falls back to MOCK_MEDIA_FILES
   * BACKEND: Will use GET /users/portfolio
   */
  async getPortfolio(): Promise<PortfolioItem[]> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // const response = await apiClient.get<PortfolioItem[]>(
    //   API_ENDPOINTS.USER_PORTFOLIO
    // );
    // return response.data;

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check localStorage first (for uploaded portfolio items)
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PORTFOLIO);
      if (stored) {
        const savedPortfolio = JSON.parse(stored) as PortfolioItem[];
        if (savedPortfolio && savedPortfolio.length > 0) {
          return savedPortfolio;
        }
      }
    } catch (error) {
      logger.error("Error loading saved portfolio:", error);
    }

    // Get logged-in user ID to fetch user-specific portfolio
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const user: { id: string; userType: string } = JSON.parse(storedUser);
        if (user.userType === "user" && user.id) {
          const userId = user.id;
          const userPortfolio = MOCK_MEDIA_FILES_MAP[userId];
          if (userPortfolio && userPortfolio.length > 0) {
            return userPortfolio.map((media) => ({
              id: media.id,
              name: media.fileName,
              type: media.fileType,
              uploadDate: media.uploadDate,
              size: `${(media.sizeKB / 1024).toFixed(2)} MB`,
              url: media.url,
            }));
          }
        }
      }
    } catch (error) {
      logger.error("Error getting logged-in user ID for portfolio:", error);
    }

    // Fallback to default mock portfolio
    return MOCK_MEDIA_FILES.map((media) => ({
      id: media.id,
      name: media.fileName,
      type: media.fileType,
      uploadDate: media.uploadDate,
      size: `${(media.sizeKB / 1024).toFixed(2)} MB`,
      url: media.url,
    }));
  },

  /**
   * Delete portfolio item
   *
   * MOCK: Removes from localStorage
   * BACKEND: DELETE /users/portfolio/:id
   */
  async deletePortfolio(id: string): Promise<void> {
    // ========================================================================
    // BACKEND API (ENABLE LATER)
    // ========================================================================
    // await apiClient.delete(API_ENDPOINTS.USER_PORTFOLIO_BY_ID(id));

    // ========================================================================
    // MOCK DATA (CURRENT)
    // ========================================================================
    await new Promise((resolve) => setTimeout(resolve, 300));
    try {
      const currentPortfolio = await this.getPortfolio();
      const updatedPortfolio = currentPortfolio.filter(
        (item) => item.id !== id
      );
      localStorage.setItem(
        STORAGE_KEYS.USER_PORTFOLIO,
        JSON.stringify(updatedPortfolio)
      );
    } catch (error) {
      logger.error("Error deleting portfolio item:", error);
      throw error;
    }
  },
};

export default userService;
