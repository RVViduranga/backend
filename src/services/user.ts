/**
 * User Service - API calls for user-related operations
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
import { API_ENDPOINTS, STORAGE_KEYS, DEFAULT_JOB_TYPE } from "@/constants";
import { env } from "@/config/env";
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
import type { UserProfileModel, UserProfileViewModel, EducationModel, ExperienceModel, UserCV, PortfolioItem, ProfileModel } from "@/models/profiles";
import type { UserApplicationModel } from "@/models/applications";
import type { JobSummaryModel } from "@/models/jobPosts";
import type { UserModel } from "@/models/users";
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

// UserCV and PortfolioItem are now imported from @/models/profiles
// Re-export for backward compatibility
export type { UserCV, PortfolioItem };

// ============================================================================
// USER SERVICE - MOCK/BACKEND MODE
// ============================================================================

export const userService = {
  /**
   * Get user profile (Backend-Aligned)
   * Returns UserModel + ProfileModel separately
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses logged-in user ID from localStorage to get correct user profile
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getUser(): Promise<UserModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getUser");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Get logged-in user ID from localStorage (stored by AuthContext)
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (storedUser) {
          const user: { id: string; userType: string } = JSON.parse(storedUser);
          if (user.userType === "user" && user.id) {
            const userId = user.id;
            
            // ✅ FIXED: Check localStorage first for updated user data (where updateUser stores it)
            const updatedUserData = localStorage.getItem(`user_data_${userId}`);
            if (updatedUserData) {
              try {
                const updatedUser = JSON.parse(updatedUserData) as UserModel;
                return updatedUser;
              } catch (error) {
                logger.error("Error parsing updated user data:", error);
              }
            }
            
            // Fallback to legacy profile if no updated data found
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getUser");
    // Backend doesn't have /users/profile endpoint - need to get user ID from auth token
    // For now, use /users/:id - but we need the user ID from auth context
    // NOTE: Backend should extract userId from JWT token in middleware
    // Backend returns: UserModel directly (not wrapped)
    const response = await apiClient.get<UserModel>(
      API_ENDPOINTS.USER_PROFILE || "/users/me" // Fallback if endpoint doesn't exist
    );
    // Backend returns user directly: { id, fullName, email, createdAt, updatedAt }
    return response.data;
  },

  /**
   * Get user profile (Legacy - Deprecated)
   * @deprecated Use getUser() + getProfile() instead, or use getProfileViewModel() for UI
   * Kept for backward compatibility during migration
   * 
   * ✅ FIXED: Now reads from localStorage where updates are stored
   */
  async getProfile(): Promise<UserProfileModel> {
    const user = await this.getUser();
    const profile = await this.getProfileData(user.id);
    
    // ✅ FIXED: Load education and experience arrays from localStorage (where updateProfile stores them)
    let education: EducationModel[] = [];
    let experience: ExperienceModel[] = [];
    try {
      const educationStored = localStorage.getItem(`user_education_${user.id}`);
      const experienceStored = localStorage.getItem(`user_experience_${user.id}`);
      if (educationStored) {
        education = JSON.parse(educationStored) as EducationModel[];
      } else {
        // Fallback to legacy profile if available
        const legacyProfile = MOCK_USER_PROFILES[user.id];
        education = legacyProfile?.education || [];
      }
      if (experienceStored) {
        experience = JSON.parse(experienceStored) as ExperienceModel[];
      } else {
        // Fallback to legacy profile if available
        const legacyProfile = MOCK_USER_PROFILES[user.id];
        experience = legacyProfile?.experience || [];
      }
    } catch (error) {
      logger.error("Error loading education/experience from localStorage:", error);
      // Fallback to legacy profile
      const legacyProfile = MOCK_USER_PROFILES[user.id];
      education = legacyProfile?.education || [];
      experience = legacyProfile?.experience || [];
    }
    
    // Transform to legacy format for backward compatibility
    return {
      id: user.id,
      fullName: user.fullName, // ✅ Backend uses fullName
      email: user.email,
      phone: profile?.phone || "",
      headline: profile?.headline || "",
      location: profile?.location || "",
      avatarUrl: profile?.avatarUrl || "",
      cvUploaded: profile?.cvUploaded || false,
      education: education || [],
      experience: experience || [],
    } as UserProfileModel;
  },

  /**
   * Get profile data (Backend-Aligned)
   * Returns ProfileModel separately from UserModel
   * 
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Reads from localStorage where updates are stored
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getProfileData(userId: string): Promise<ProfileModel | undefined> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getProfileData");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // ✅ FIXED: Check localStorage first for updated profile data (where updateProfileData stores it)
      try {
        const updatedProfileData = localStorage.getItem(`user_profile_${userId}`);
        if (updatedProfileData) {
          try {
            const updatedProfile = JSON.parse(updatedProfileData) as ProfileModel;
            return updatedProfile;
          } catch (error) {
            logger.error("Error parsing updated profile data:", error);
          }
        }
      } catch (error) {
        logger.error("Error reading updated profile data from localStorage:", error);
      }

      // Fallback to legacy profile if no updated data found
      try {
        const legacyProfile = MOCK_USER_PROFILES[userId];
        if (legacyProfile) {
          return normalizeProfileData(legacyProfile, userId);
        }
      } catch (error) {
        logger.error("Error getting profile data:", error);
      }

      return undefined;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getProfileData");
    // Backend profiles endpoint: GET /api/profiles/:id or GET /api/profiles?user=userId
    // Backend returns: { success: true, data: ProfileModel, message: string }
    const response = await apiClient.get<{ success: boolean; data: ProfileModel; message: string }>(
      API_ENDPOINTS.USER_PROFILE_DETAILS || `/profiles?user=${userId}`
    );
    return response.data.data; // Extract data field
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
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Stores updates in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async updateUser(
    userId: string,
    updates: Partial<UserModel>
  ): Promise<UserModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for updateUser");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for updateUser");
    // Backend expects: { fullName, email, password? }
    // Backend returns: { message: string, user: { id, fullName, email } }
    const backendUpdates: Partial<{ fullName: string; email: string; password?: string }> = {};
    if (updates.fullName) backendUpdates.fullName = updates.fullName;
    if (updates.email) backendUpdates.email = updates.email;
    if (updates.password) backendUpdates.password = updates.password;
    
    const response = await apiClient.patch<{ message: string; user: { id: string; fullName: string; email: string } }>(
      API_ENDPOINTS.USER_PROFILE || `/users/${userId}`,
      backendUpdates
    );
    // Transform backend response to UserModel
    return {
      id: response.data.user.id,
      fullName: response.data.user.fullName,
      email: response.data.user.email,
      createdAt: updates.createdAt,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * Update profile record (Backend-Aligned)
   * Updates the profiles collection
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Stores updates in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async updateProfileData(
    userId: string,
    updates: Partial<ProfileModel>
  ): Promise<ProfileModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for updateProfileData");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for updateProfileData");
    // Backend profiles endpoint: PUT /api/profiles/:id
    // Backend returns: { success: true, data: ProfileModel, message: string }
    const response = await apiClient.put<{ success: boolean; data: ProfileModel; message: string }>(
      API_ENDPOINTS.USER_PROFILE_DETAILS || `/profiles/${userId}`,
      updates
    );
    return response.data.data; // Extract data field
  },

  /**
   * Update user profile (Legacy - Deprecated)
   * @deprecated Use getUser() + getProfile() instead, or use getProfileViewModel() for UI
   * Kept for backward compatibility during migration
   * 
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Transforms legacy UserProfileModel to backend-aligned format
   * - Stores updates in localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async updateProfile(
    updates: Partial<UserProfileModel>
  ): Promise<UserProfileModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for updateProfile");
      await new Promise((resolve) => setTimeout(resolve, 500));
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

    // ✅ FIXED: Return actual updated profile by calling getProfile() which reads from localStorage
    // This ensures the read path reflects the write path correctly
    return await this.getProfile();
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for updateProfile");
    // Get current user to get userId
    const user = await this.getUser();
    const userId = user.id;
    
    // Transform updates to backend format
    // Backend User model: fullName, email, password
    // Backend Profile model: user, fullName, email, phone, headline, location, avatarUrl, cvUploaded, education[], experience[], mediaFiles[]
    const userUpdates: Partial<{ fullName: string; email: string }> = {};
    const profileUpdates: Partial<ProfileModel> = {};
    
    if (updates.fullName) {
      userUpdates.fullName = updates.fullName; // Backend uses fullName, not firstName/lastName
    }
    if (updates.email) {
      userUpdates.email = updates.email;
      profileUpdates.email = updates.email; // Profile also has email
    }
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.location) profileUpdates.location = updates.location;
    if (updates.headline) profileUpdates.headline = updates.headline;
    
    // Handle education and experience arrays (backend Profile has these as embedded arrays)
    if (updates.education) {
      profileUpdates.education = updates.education;
    }
    if (updates.experience) {
      profileUpdates.experience = updates.experience;
    }
    
    // Update user and profile separately
    // Backend user endpoint: PUT /api/users/:id
    // Backend profile endpoint: PUT /api/profiles/:id
    if (Object.keys(userUpdates).length > 0) {
      const userResponse = await apiClient.put<{ message: string; user: { id: string; fullName: string; email: string } }>(
        `/users/${userId}`,
        userUpdates
      );
      // Update local user data
      userUpdates.fullName = userResponse.data.user.fullName;
      userUpdates.email = userResponse.data.user.email;
    }
    
    if (Object.keys(profileUpdates).length > 0) {
      // Get profile ID first (profile.user === userId)
      const profileResponse = await apiClient.get<{ success: boolean; data: ProfileModel[]; message: string }>(
        `/profiles?user=${userId}`
      );
      const profiles = profileResponse.data.data;
      if (profiles.length > 0) {
        const profileId = profiles[0].id;
        await apiClient.put<{ success: boolean; data: ProfileModel; message: string }>(
          `/profiles/${profileId}`,
          profileUpdates
        );
      } else {
        // Create profile if it doesn't exist
        profileUpdates.user = userId;
        profileUpdates.fullName = userUpdates.fullName || user.fullName;
        profileUpdates.email = userUpdates.email || user.email;
        await apiClient.post<{ success: boolean; data: ProfileModel; message: string }>(
          "/profiles",
          profileUpdates
        );
      }
    }
    
    // Return legacy format for backward compatibility
    return await this.getProfile();
  },

  /**
   * Get user's saved jobs
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Loads job IDs from localStorage and matches with mock job data
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getSavedJobs(): Promise<JobSummaryModel[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getSavedJobs");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getSavedJobs");
    // Backend endpoint: GET /api/savedJobs (returns SavedJobModel[] with populated job)
    // Backend returns: SavedJobModel[] directly (not wrapped)
    const response = await apiClient.get<Array<{ id: string; user: string; job: any; savedAt: string }>>(
      "/savedJobs"
    );
    // Transform SavedJobModel[] to JobSummaryModel[]
    return response.data.map((savedJob) => {
      const job = savedJob.job;
      return {
        id: job._id || job.id,
        title: job.title,
        company: job.company || { id: "", name: "", logoUrl: "" },
        location: job.location,
        jobType: job.jobType,
        postedDate: job.postedDate,
        industry: job.industry,
        experienceLevel: job.experienceLevel,
        status: job.status,
      };
    });
  },

  /**
   * Save a job
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
  async saveJob(jobId: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for saveJob");
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
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for saveJob");
    // Backend endpoint: POST /api/savedJobs
    // Backend expects: { jobId: string }
    // Backend returns: SavedJobModel
    await apiClient.post("/savedJobs", { jobId });
  },

  /**
   * Unsave a job
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
  async unsaveJob(jobId: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for unsaveJob");
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
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for unsaveJob");
    // Backend endpoint: DELETE /api/savedJobs/:id
    // Need to find savedJob ID first by jobId
    const savedJobsResponse = await apiClient.get<Array<{ id: string; job: string | { _id: string } }>>("/savedJobs");
    const savedJob = savedJobsResponse.data.find((sj) => {
      const jobIdFromSaved = typeof sj.job === "string" ? sj.job : sj.job._id;
      return jobIdFromSaved === jobId;
    });
    if (savedJob) {
      await apiClient.delete(`/savedJobs/${savedJob.id}`);
    } else {
      throw new Error("Saved job not found");
    }
  },

  /**
   * Get user's job applications
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses logged-in user ID to get correct applications, or loads from localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getApplications(): Promise<UserApplicationModel[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getApplications");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getApplications");
    // Backend endpoint: GET /api/applications (filtered by applicant from auth token)
    // Backend returns: ApplicationModel[] directly (not wrapped)
    const response = await apiClient.get<Array<{
      _id: string;
      job: any;
      applicant: string;
      cvFilePath: string;
      appliedAt: string;
      status: string;
    }>>(
      "/applications"
    );
    // Transform backend ApplicationModel[] to UserApplicationModel[]
    return Promise.all(
      response.data.map(async (app) => {
        // Get job details
        const job = await jobService.getJobById(typeof app.job === "string" ? app.job : app.job._id);
        return {
          id: app._id,
          jobId: typeof app.job === "string" ? app.job : app.job._id,
          appliedDate: app.appliedAt,
          status: app.status as any,
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
      })
    );
  },

  /**
   * Get a single application by ID
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Searches through user's applications
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getApplicationById(id: string): Promise<UserApplicationModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getApplicationById");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getApplicationById");
    // Backend endpoint: GET /api/applications/:id
    // Backend returns: ApplicationModel directly (not wrapped)
    const response = await apiClient.get<{
      _id: string;
      job: any;
      applicant: string;
      cvFilePath: string;
      appliedAt: string;
      status: string;
    }>(
      `/applications/${id}`
    );
    const app = response.data;
    // Get job details
    const job = await jobService.getJobById(typeof app.job === "string" ? app.job : app.job._id);
    return {
      id: app._id,
      jobId: typeof app.job === "string" ? app.job : app.job._id,
      appliedDate: app.appliedAt,
      status: app.status as any,
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
  },

  /**
   * Upload CV
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates mock CV entry and adds to localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async uploadCV(file: File, name: string): Promise<UserCV> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for uploadCV");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for uploadCV");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    const response = await apiClient.post<UserCV>(
      API_ENDPOINTS.USER_CV_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get user's CVs
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Checks localStorage first, then falls back to MOCK_USER_CVS
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getCVs(): Promise<UserCV[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getCVs");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getCVs");
    const response = await apiClient.get<UserCV[]>(API_ENDPOINTS.USER_CV);
    return response.data;
  },

  /**
   * Delete a CV
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
  async deleteCV(id: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for deleteCV");
      await new Promise((resolve) => setTimeout(resolve, 300));
      try {
        const currentCVs = await this.getCVs();
        const updatedCVs = currentCVs.filter((cv) => cv.id !== id);
        localStorage.setItem(STORAGE_KEYS.USER_CVS, JSON.stringify(updatedCVs));
      } catch (error) {
        logger.error("Error deleting CV:", error);
        throw error;
      }
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for deleteCV");
    await apiClient.delete(API_ENDPOINTS.USER_CV_BY_ID(id));
  },

  /**
   * Set primary CV
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Updates localStorage to mark CV as primary
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async setPrimaryCV(id: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for setPrimaryCV");
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
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for setPrimaryCV");
    await apiClient.post(API_ENDPOINTS.USER_CV_PRIMARY(id));
  },

  /**
   * Upload portfolio item
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates mock portfolio entry and adds to localStorage
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async uploadPortfolio(
    file: File,
    name: string,
    type: string
  ): Promise<PortfolioItem> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for uploadPortfolio");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for uploadPortfolio");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("type", type);
    const response = await apiClient.post<PortfolioItem>(
      API_ENDPOINTS.USER_PORTFOLIO_UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get user's portfolio items
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Checks localStorage first, then falls back to MOCK_MEDIA_FILES
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async getPortfolio(): Promise<PortfolioItem[]> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getPortfolio");
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
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getPortfolio");
    const response = await apiClient.get<PortfolioItem[]>(
      API_ENDPOINTS.USER_PORTFOLIO
    );
    return response.data;
  },

  /**
   * Delete portfolio item
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
  async deletePortfolio(id: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for deletePortfolio");
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
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for deletePortfolio");
    await apiClient.delete(API_ENDPOINTS.USER_PORTFOLIO_BY_ID(id));
  },
};

export default userService;
