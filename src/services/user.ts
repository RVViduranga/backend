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
import jobService from "./job";
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, DEFAULT_JOB_TYPE } from "@/constants";
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
import type { UserProfileModel, UserProfileViewModel, EducationModel, ExperienceModel, UserCV, ProfileModel } from "@/models/profiles";
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

// UserCV is imported from @/models/profiles
// Re-export for backward compatibility
export type { UserCV };

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
    // Get user ID from localStorage (stored by AuthContext after login)
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (storedUser) {
        const authUser: { id: string; email: string; userType: string; name?: string } = JSON.parse(storedUser);
        if (authUser.id) {
          const userId = authUser.id;
          // Fetch user from backend using userId
          const response = await apiClient.get<UserModel>(
            `/users/${userId}`
          );
          // Backend returns user directly: { id, fullName, email, createdAt, updatedAt }
          logger.info("[UserService] Successfully fetched user from backend:", response.data);
          return response.data;
        }
      }
    } catch (error) {
      logger.error("[UserService] Error getting user ID from localStorage:", error);
    }
    
    // Fallback: throw error if no user ID found
    throw new Error("User not found. Please log in again.");
  },

  /**
   * Get user by ID (Public)
   * Fetches a user's public information by their user ID
   * 
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses mock data from localStorage
   * 
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API: GET /api/users/:id
   */
  async getUserById(userId: string): Promise<UserModel> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getUserById");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Try to get from localStorage first
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
        if (storedUsers) {
          const user = JSON.parse(storedUsers);
          if (user.id === userId) {
            return normalizeUserData(user);
          }
        }
      } catch (error) {
        logger.error("Error reading user from localStorage:", error);
      }

      // Fallback to mock data
      if (MOCK_USER_PROFILE.id === userId) {
        return normalizeUserData(MOCK_USER_PROFILE);
      }

      throw new Error("User not found");
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getUserById");
    try {
      const response = await apiClient.get<UserModel>(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      logger.error("[UserService] Error fetching user by ID:", error);
      if (error?.response?.status === 404) {
        throw new Error("User not found");
      }
      throw error;
    }
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
    
    // Load education and experience
    let education: EducationModel[] = [];
    let experience: ExperienceModel[] = [];
    
    if (env.DATA_MODE === "mock") {
      // MOCK MODE: Load from localStorage
      try {
        const educationStored = localStorage.getItem(`user_education_${user.id}`);
        const experienceStored = localStorage.getItem(`user_experience_${user.id}`);
        if (educationStored) {
          education = JSON.parse(educationStored) as EducationModel[];
        } else {
          const legacyProfile = MOCK_USER_PROFILES[user.id];
          education = legacyProfile?.education || [];
        }
        if (experienceStored) {
          experience = JSON.parse(experienceStored) as ExperienceModel[];
        } else {
          const legacyProfile = MOCK_USER_PROFILES[user.id];
          experience = legacyProfile?.experience || [];
        }
      } catch (error) {
        logger.error("Error loading education/experience from localStorage:", error);
        const legacyProfile = MOCK_USER_PROFILES[user.id];
        education = legacyProfile?.education || [];
        experience = legacyProfile?.experience || [];
      }
    } else {
      // BACKEND MODE: Get from profile (from database)
      education = profile?.education || [];
      experience = profile?.experience || [];
    }
    
    // Transform to legacy format for backward compatibility
    return {
      id: user.id,
      fullName: user.fullName, // ✅ From User collection
      email: user.email, // ✅ From User collection
      phone: profile?.phone || "", // From Profile collection (empty if not set)
      headline: profile?.headline || "", // From Profile collection (empty if not set)
      location: profile?.location || "", // From Profile collection (empty if not set)
      avatarUrl: profile?.avatarUrl || "", // From Profile collection (empty if not set)
      cvUploaded: profile?.cvUploaded || false, // From Profile collection
      education: education || [], // From Profile collection
      experience: experience || [], // From Profile collection
      // New detailed fields
      dateOfBirth: profile?.dateOfBirth || "", // From Profile collection
      nationality: profile?.nationality || "", // From Profile collection
      address: profile?.address || "", // From Profile collection
      city: profile?.city || "", // From Profile collection
      state: profile?.state || "", // From Profile collection
      zipCode: profile?.zipCode || "", // From Profile collection
      country: profile?.country || "", // From Profile collection
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
    // Backend profiles endpoint: GET /api/profiles?user=userId
    // Backend returns: { success: true, data: ProfileModel[], message: string }
    try {
      const response = await apiClient.get<{ success: boolean; data: ProfileModel[]; message: string }>(
        `/profiles?user=${userId}`
      );
      const profiles = response.data.data;
      if (profiles && profiles.length > 0) {
        // Return first profile (should only be one per user)
        return profiles[0];
      }
      // Profile doesn't exist yet - create it with user's fullName and email
      logger.info("[UserService] No profile found, creating one with user data");
      const user = await this.getUser();
      const newProfile = {
        user: userId,
        fullName: user.fullName,
        email: user.email,
        phone: '',
        headline: '',
        location: '',
        avatarUrl: '',
        cvUploaded: false,
        education: [],
        experience: [],
        cvs: [],
        mediaFiles: [],
        projects: [],
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
        nationality: '',
        state: '',
        zipCode: '',
      };
      const createResponse = await apiClient.post<{ success: boolean; data: ProfileModel; message: string }>(
        '/profiles',
        newProfile
      );
      return createResponse.data.data;
    } catch (error: any) {
      // If profile doesn't exist (404), create it
      if (error?.response?.status === 404) {
        logger.info("[UserService] Profile not found (404), creating one with user data");
        const user = await this.getUser();
        const newProfile = {
          user: userId,
          fullName: user.fullName,
          email: user.email,
          phone: '',
          headline: '',
          location: '',
          avatarUrl: '',
          cvUploaded: false,
          education: [],
          experience: [],
          mediaFiles: [],
        };
        const createResponse = await apiClient.post<{ success: boolean; data: ProfileModel; message: string }>(
          '/profiles',
          newProfile
        );
        return createResponse.data.data;
      }
      throw error;
    }
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
    if (!currentProfile) {
      throw new Error(`Profile not found for user ${userId}`);
    }
    
    // Merge updates with current profile, preserving ProfileModel structure
    const updatedProfile: ProfileModel = {
      ...currentProfile,
      ...updates,
      // Ensure required fields are present
      id: currentProfile.id || `profile_${userId}`,
      user: userId,
      fullName: updates.fullName ?? currentProfile.fullName,
      email: updates.email ?? currentProfile.email,
      cvUploaded: updates.cvUploaded ?? currentProfile.cvUploaded,
      education: updates.education ?? currentProfile.education ?? [],
      experience: updates.experience ?? currentProfile.experience ?? [],
      cvs: updates.cvs ?? currentProfile.cvs ?? [],
      mediaFiles: updates.mediaFiles ?? currentProfile.mediaFiles ?? [],
      projects: updates.projects ?? currentProfile.projects ?? [],
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

    // Handle fullName - UserModel uses fullName directly
    if (updates.fullName) {
      userUpdates.fullName = updates.fullName;
    }

    // Handle user fields (UserModel only has: id, fullName, email, password, createdAt, updatedAt)
    if (updates.email) userUpdates.email = updates.email;
    
    // Handle profile fields (phone and location belong to ProfileModel, not UserModel)
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.location) profileUpdates.location = updates.location;
    
    // Handle profile array fields (experience and education are arrays, not numbers)
    if (updates.experience && Array.isArray(updates.experience)) {
      profileUpdates.experience = updates.experience;
    }
    if (updates.education && Array.isArray(updates.education)) {
      profileUpdates.education = updates.education;
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
    // ❌ Email should NOT be updated - it's locked in the UI
    // Email comes from User collection and should remain unchanged
    // if (updates.email) {
    //   userUpdates.email = updates.email;
    //   profileUpdates.email = updates.email; // Profile also has email
    // }
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.location) profileUpdates.location = updates.location;
    if (updates.headline) profileUpdates.headline = updates.headline;
    if (updates.avatarUrl) profileUpdates.avatarUrl = updates.avatarUrl;
    
    // Handle detailed address fields
    if (updates.address !== undefined) profileUpdates.address = updates.address;
    if (updates.city !== undefined) profileUpdates.city = updates.city;
    if (updates.state !== undefined) profileUpdates.state = updates.state;
    if (updates.zipCode !== undefined) profileUpdates.zipCode = updates.zipCode;
    if (updates.country !== undefined) profileUpdates.country = updates.country;
    
    // Handle personal information fields
    if (updates.dateOfBirth !== undefined) profileUpdates.dateOfBirth = updates.dateOfBirth;
    if (updates.nationality !== undefined) profileUpdates.nationality = updates.nationality;
    
    // Handle education and experience arrays (backend Profile has these as embedded arrays)
    if (updates.education) {
      profileUpdates.education = updates.education;
    }
    if (updates.experience) {
      profileUpdates.experience = updates.experience;
    }
    
    // Handle mediaFiles array (for profile photos, CVs, portfolio items)
    if ((updates as any).mediaFiles !== undefined) {
      profileUpdates.mediaFiles = (updates as any).mediaFiles;
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
        // Ensure profile has user's current fullName and email (from User collection)
        profileUpdates.fullName = user.fullName; // Always sync with User collection
        profileUpdates.email = user.email; // Always sync with User collection
        await apiClient.put<{ success: boolean; data: ProfileModel; message: string }>(
          `/profiles/${profileId}`,
          profileUpdates
        );
      } else {
        // Create profile if it doesn't exist
        profileUpdates.user = userId;
        profileUpdates.fullName = user.fullName; // From User collection
        profileUpdates.email = user.email; // From User collection
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
      
      // Check if this is the first CV
      const currentCVs = await this.getCVs();
      const isFirstCV = currentCVs.length === 0;
      
      const newCV: UserCV = {
        id: `cv_${Date.now()}`,
        name,
        fileName: file.name,
        uploadedDate: new Date().toISOString(),
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        isPrimary: isFirstCV, // Set as primary if it's the first CV
        format: file.name.split(".").pop()?.toUpperCase() || "PDF",
        downloadUrl: URL.createObjectURL(file),
      };

      // If this is the first CV, unset primary on all other CVs (shouldn't be any, but just to be safe)
      const updatedCVs = currentCVs.map(cv => ({ ...cv, isPrimary: false }));
      updatedCVs.push(newCV);
      
      // Store in localStorage for mock persistence
      localStorage.setItem(STORAGE_KEYS.USER_CVS, JSON.stringify(updatedCVs));

      return newCV;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for uploadCV");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    const response = await apiClient.post<{ success: boolean; data: UserCV; message: string }>(
      API_ENDPOINTS.USER_CV_UPLOAD,
      formData
      // Don't pass headers - interceptor will add Authorization, and axios will set Content-Type with boundary
    );
    return response.data.data;
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
              uploadedDate: cv.uploadedDate,
              fileSize: cv.fileSize,
              isPrimary: cv.isPrimary,
              format: cv.format,
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
      uploadedDate: cv.uploadedDate,
      fileSize: cv.fileSize,
      isPrimary: cv.isPrimary,
      format: cv.format,
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



  // ========================================================================
  // PROJECT SERVICE METHODS (New - stores projects as single entities)
  // ========================================================================

  /**
   * Create a new project (with files and/or link)
   */
  async createProject(data: {
    title: string;
    description?: string;
    category?: string;
    platform?: string;
    isFeatured?: boolean;
    projectLink?: string;
    files?: File[];
  }): Promise<any> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for createProject");
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Mock implementation - return a mock project
      return {
        id: `project_${Date.now()}`,
        title: data.title,
        description: data.description || '',
        category: data.category || '',
        platform: data.platform || 'File Upload',
        isFeatured: data.isFeatured || false,
        projectLink: data.projectLink,
        files: [],
        uploadedDate: new Date().toISOString(),
      };
    }

    logger.info("[UserService] Using BACKEND mode for createProject");
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    if (data.platform) formData.append('platform', data.platform);
    if (data.isFeatured !== undefined) formData.append('isFeatured', String(data.isFeatured));
    if (data.projectLink) formData.append('projectLink', data.projectLink);
    
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.post<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.PROJECTS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Get all projects for the authenticated user
   */
  async getProjects(): Promise<any[]> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getProjects");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [];
    }

    logger.info("[UserService] Using BACKEND mode for getProjects");
    const response = await apiClient.get<{ success: boolean; data: any[]; message: string }>(
      API_ENDPOINTS.PROJECTS
    );
    return response.data.data;
  },

  /**
   * Update a project (metadata only)
   */
  async updateProject(id: string, data: {
    title?: string;
    description?: string;
    category?: string;
    platform?: string;
    isFeatured?: boolean;
    projectLink?: string;
  }): Promise<any> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for updateProject");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, ...data };
    }

    logger.info("[UserService] Using BACKEND mode for updateProject");
    const response = await apiClient.put<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.PROJECT_BY_ID(id),
      data
    );
    return response.data.data;
  },

  /**
   * Add files to an existing project
   */
  async addFilesToProject(projectId: string, files: File[]): Promise<any> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for addFilesToProject");
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { id: projectId, files: [] };
    }

    logger.info("[UserService] Using BACKEND mode for addFilesToProject");
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiClient.post<{ success: boolean; data: any; message: string }>(
      API_ENDPOINTS.PROJECT_FILES(projectId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for deleteProject");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    logger.info("[UserService] Using BACKEND mode for deleteProject");
    await apiClient.delete(API_ENDPOINTS.PROJECT_BY_ID(id));
  },

  /**
   * Delete a file from a project
   */
  async deleteFileFromProject(projectId: string, fileId: string): Promise<void> {
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for deleteFileFromProject");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    logger.info("[UserService] Using BACKEND mode for deleteFileFromProject");
    await apiClient.delete(API_ENDPOINTS.PROJECT_FILE_DELETE(projectId, fileId));
  },

  /**
   * Upload profile avatar
   *
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Creates mock avatar URL
   * - Use when backend is not available
   *
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API only
   * - Use when backend is available
   * - Throws error if backend unavailable
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for uploadAvatar");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create mock avatar URL
      const avatarUrl = URL.createObjectURL(file);
      
      // Update profile with avatar URL
      try {
        const profile = await this.getProfile();
        await this.updateProfile({ avatarUrl });
      } catch (error) {
        logger.error("Error updating profile with avatar URL:", error);
      }
      
      return { avatarUrl };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for uploadAvatar");
    
    // Check if token exists (for debugging)
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      logger.error("[UserService] No auth token found in localStorage");
      throw new Error("You must be logged in to upload a profile photo. Please log in and try again.");
    }
    logger.info("[UserService] Auth token found, proceeding with upload");
    
    const formData = new FormData();
    formData.append("avatar", file); // Backend expects "avatar" field name
    logger.info("[UserService] FormData created with file:", file.name, "Type:", file.type, "Size:", file.size);
    
    // Don't set Content-Type manually - let axios set it with boundary for multipart/form-data
    // The api-client interceptor will add Authorization header automatically
    // If token is missing, backend will return 401 and interceptor will handle it
    const response = await apiClient.post<{
      success: boolean;
      data: {
        avatarUrl: string;
        profile: ProfileModel;
      };
      message: string;
    }>(
      "/profiles/avatar",
      formData
      // Don't pass headers - interceptor will add Authorization, and axios will set Content-Type with boundary
    );
    
    // The avatarUrl is returned in response.data.data.avatarUrl
    // Backend returns: /uploads/userprofileAvatar/filename.jpg
    // We need to construct the full URL for frontend to display
    const baseUrl = API_BASE_URL.replace('/api', ''); // Remove /api to get base URL
    const avatarUrl = response.data.data.avatarUrl.startsWith('http') 
      ? response.data.data.avatarUrl 
      : `${baseUrl}${response.data.data.avatarUrl}`;
    
    // Update profile with avatarUrl (will be saved in database)
    try {
      await this.updateProfile({ avatarUrl });
      // Refresh profile query
      logger.info("[UserService] Profile updated with avatar URL:", avatarUrl);
    } catch (error) {
      logger.warn("[UserService] Failed to update profile with avatar URL (avatar already saved by backend):", error);
    }
    
    return { avatarUrl };
  },

  /**
   * Upload profile photo to mediaFiles array
   * Allows multiple profile photos to be stored
   */
  async uploadProfilePhoto(file: File, setAsPrimary: boolean = false): Promise<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
    url: string;
  }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for uploadProfilePhoto");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const photoId = `photo_${Date.now()}`;
      const photoUrl = URL.createObjectURL(file);
      
      return {
        id: photoId,
        name: file.name,
        type: "photo",
        uploadDate: new Date().toISOString(),
        size: `${Math.round(file.size / 1024)} KB`,
        url: photoUrl,
      };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for uploadProfilePhoto");
    
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      logger.error("[UserService] No auth token found in localStorage");
      throw new Error("You must be logged in to upload a profile photo. Please log in and try again.");
    }
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "Profile Photo");
    if (setAsPrimary) {
      formData.append("isPrimary", "true");
    }
    
    const response = await apiClient.post<{
      success: boolean;
      data: {
        id: string;
        name: string;
        type: string;
        uploadDate: string;
        size: string;
        url: string;
      };
      message: string;
    }>(
      "/profiles/media",
      formData
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to upload profile photo");
    }
    
    // If this photo is set as primary, also update avatarUrl
    if (setAsPrimary) {
      const photoUrl = response.data.data.url;
      // Construct full URL if it's a relative path
      const baseUrl = API_BASE_URL.replace('/api', '');
      const fullPhotoUrl = photoUrl.startsWith('http') 
        ? photoUrl 
        : `${baseUrl}${photoUrl}`;
      
      try {
        await this.updateProfile({ avatarUrl: fullPhotoUrl });
        logger.info("[UserService] Updated avatarUrl with primary profile photo:", fullPhotoUrl);
      } catch (error) {
        logger.warn("[UserService] Failed to update avatarUrl (photo already in mediaFiles):", error);
      }
    }
    
    return response.data.data;
  },

  /**
   * Get profile photos from mediaFiles array
   */
  async getProfilePhotos(): Promise<Array<{
    id: string;
    name: string;
    fileName: string;
    uploadDate: string;
    size: string;
    url: string;
    isPrimary?: boolean;
  }>> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for getProfilePhotos");
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const profile = await this.getProfile();
      if (profile.avatarUrl) {
        return [{
          id: "avatar",
          name: "Profile Photo",
          fileName: "profile-photo.jpg",
          uploadDate: new Date().toISOString(),
          size: "N/A",
          url: profile.avatarUrl,
          isPrimary: true,
        }];
      }
      return [];
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for getProfilePhotos");
    
    // Get profile data directly (includes mediaFiles)
    const user = await this.getUser();
    const profile = await this.getProfileData(user.id);
    const baseUrl = API_BASE_URL.replace('/api', '');
    
    // Filter mediaFiles to get only Profile Photos
    let profilePhotos = (profile?.mediaFiles || [])
      .filter((file: any) => file.fileType === 'Profile Photo')
      .map((file: any) => ({
        id: file.id,
        name: file.name || file.fileName,
        fileName: file.fileName,
        uploadDate: file.uploadDate,
        size: `${file.sizeKB} KB`,
        url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
        isPrimary: file.isPrimary || false,
      }));
    
    // If there's an avatarUrl but no profile photos in mediaFiles, 
    // create a virtual entry (for backward compatibility with old uploads)
    if (profilePhotos.length === 0 && profile?.avatarUrl) {
      profilePhotos = [{
        id: 'avatar_legacy',
        name: 'Profile Photo',
        fileName: 'profile-photo.jpg',
        uploadDate: new Date().toISOString(),
        size: 'N/A',
        url: profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${baseUrl}${profile.avatarUrl}`,
        isPrimary: true,
      }];
    }
    
    return profilePhotos;
  },

  /**
   * Set a profile photo as primary
   * Updates both mediaFiles and avatarUrl
   */
  async setPrimaryProfilePhoto(photoId: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for setPrimaryProfilePhoto");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for setPrimaryProfilePhoto");
    
    const response = await apiClient.post<{
      success: boolean;
      data: null;
      message: string;
    }>(`/profiles/media/photo/${photoId}/primary`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to set primary profile photo");
    }
  },

  /**
   * Delete a profile photo
   * Deletes from both database and server file system
   */
  async deleteProfilePhoto(photoId: string): Promise<void> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for deleteProfilePhoto");
      await new Promise((resolve) => setTimeout(resolve, 300));
      return;
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for deleteProfilePhoto");
    
    const response = await apiClient.delete<{
      success: boolean;
      data: null;
      message: string;
    }>(`/profiles/media/photo/${photoId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete profile photo");
    }
  },

  /**
   * Search candidates/profiles (Public)
   * Searches for user profiles by name, location, skills, etc.
   * 
   * MOCK MODE (default, VITE_DATA_MODE=mock):
   * - Uses mock data from localStorage
   * 
   * BACKEND MODE (VITE_DATA_MODE=backend):
   * - Uses backend API: GET /api/profiles/search
   */
  async searchCandidates(params: {
    query?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    profiles: Array<{
      id: string;
      userId: string;
      fullName: string;
      headline?: string;
      location?: string;
      avatarUrl?: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    // ========================================================================
    // MOCK MODE: Use mock data only
    // ========================================================================
    if (env.DATA_MODE === "mock") {
      logger.info("[UserService] Using MOCK mode for searchCandidates");
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get all profiles from localStorage
      const profiles: Array<{
        id: string;
        userId: string;
        fullName: string;
        headline?: string;
        location?: string;
        avatarUrl?: string;
      }> = [];

      try {
        // Try to get profiles from localStorage
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith("user_profile_")) {
            const profileData = localStorage.getItem(key);
            if (profileData) {
              const profile = JSON.parse(profileData);
              if (profile.fullName) {
                profiles.push({
                  id: profile.id || key.replace("user_profile_", ""),
                  userId: profile.user || key.replace("user_profile_", ""),
                  fullName: profile.fullName,
                  headline: profile.headline,
                  location: profile.location,
                  avatarUrl: profile.avatarUrl,
                });
              }
            }
          }
        }
      } catch (error) {
        logger.error("Error reading profiles from localStorage:", error);
      }

      // Apply search filters
      let filtered = profiles;
      if (params.query) {
        const query = params.query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.fullName.toLowerCase().includes(query) ||
            p.headline?.toLowerCase().includes(query) ||
            p.location?.toLowerCase().includes(query)
        );
      }
      if (params.location) {
        filtered = filtered.filter(
          (p) => p.location?.toLowerCase().includes(params.location!.toLowerCase())
        );
      }

      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit;

      return {
        profiles: filtered.slice(start, end),
        total: filtered.length,
        page,
        limit,
      };
    }

    // ========================================================================
    // BACKEND MODE: Use backend API only
    // ========================================================================
    logger.info("[UserService] Using BACKEND mode for searchCandidates");
    try {
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append("query", params.query);
      if (params.location) queryParams.append("location", params.location);
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      const response = await apiClient.get<{
        profiles: Array<{
          id: string;
          userId: string;
          fullName: string;
          headline?: string;
          location?: string;
          avatarUrl?: string;
        }>;
        total: number;
        page: number;
        limit: number;
      }>(`/profiles/search?${queryParams.toString()}`);

      // Handle empty results - return empty array, not error
      return {
        profiles: response.data?.profiles || [],
        total: response.data?.total || 0,
        page: response.data?.page || (params.page || 1),
        limit: response.data?.limit || (params.limit || 20),
      };
    } catch (error: any) {
      logger.error("[UserService] Error searching candidates:", error);
      throw error;
    }
  },
};

export default userService;
