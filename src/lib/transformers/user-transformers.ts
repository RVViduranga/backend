/**
 * User Transformers - Convert between backend models and UI models
 * 
 * Handles transformation between:
 * - Backend-aligned models (UserModel + ProfileModel)
 * - Legacy UserProfileModel (merged)
 * - View models for UI convenience
 */

import type { UserModel, UserRole } from "@/models/users";
import type { ProfileModel, UserProfileModel, UserProfileViewModel } from "@/models/profiles";
import { composeUserProfileViewModel } from "@/lib/view-models/user-profile-view-model";

/**
 * Transform legacy UserProfileModel to UserModel + ProfileModel
 * (Migration helper - can be removed after full migration)
 */
export function transformLegacyUserProfileToBackendModels(
  legacy: UserProfileModel
): { user: UserModel; profile?: ProfileModel } {
  // Backend UserModel uses fullName directly
  // Create UserModel from legacy data
  const user: UserModel = {
    id: legacy.id,
    fullName: legacy.fullName, // ✅ Backend uses fullName
    email: legacy.email,
  };

  // Create ProfileModel from legacy data
  const profile: ProfileModel | undefined = {
    id: `${legacy.id}_profile`, // Generate ID
    user: legacy.id,
    fullName: legacy.fullName,
    email: legacy.email,
    phone: legacy.phone,
    headline: legacy.headline || "",
    location: legacy.location,
    avatarUrl: legacy.avatarUrl,
    cvUploaded: legacy.cvUploaded,
    education: legacy.education || [],
    experience: legacy.experience || [],
    mediaFiles: [], // Legacy doesn't have mediaFiles
  };

  return { user, profile };
}

/**
 * Transform UserModel + ProfileModel to UserProfileViewModel
 * (For UI convenience)
 */
export function transformBackendModelsToViewModel(
  user: UserModel,
  profile?: ProfileModel,
  education?: any[],
  experienceHistory?: any[]
): UserProfileViewModel {
  return composeUserProfileViewModel(user, profile, education, experienceHistory);
}

/**
 * Normalize user data from various sources (mock, localStorage, API)
 */
export function normalizeUserData(data: any): UserModel {
  // If already a UserModel with fullName, return as-is
  if (data.fullName && data.email) {
    return {
      id: data.id || data._id || "",
      fullName: data.fullName,
      email: data.email,
      password: data.password, // Only for registration
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  // If legacy UserProfileModel, extract fullName
  if (data.fullName && !data.email) {
    return {
      id: data.id || "",
      fullName: data.fullName,
      email: data.email || "",
    };
  }

  // Legacy format with firstName/lastName - combine to fullName
  if (data.firstName || data.lastName) {
    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
    return {
      id: data.id || "",
      fullName: fullName || data.email || "",
      email: data.email || "",
    };
  }

  // Default fallback
  return {
    id: data.id || data._id || "",
    fullName: data.fullName || data.name || data.email || "",
    email: data.email || "",
  };
}

/**
 * Normalize profile data from various sources
 */
export function normalizeProfileData(data: any, userId: string): ProfileModel | undefined {
  if (!data) return undefined;

  return {
    id: data.id || data._id || `${userId}_profile`,
    user: userId,
    fullName: data.fullName || "",
    email: data.email || "",
    phone: data.phone,
    headline: data.headline,
    location: data.location,
    avatarUrl: data.avatarUrl,
    cvUploaded: data.cvUploaded || false,
    education: Array.isArray(data.education) ? data.education : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    mediaFiles: Array.isArray(data.mediaFiles) ? data.mediaFiles : [],
  };
}
