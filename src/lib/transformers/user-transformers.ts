/**
 * User Transformers - Convert between backend models and UI models
 * 
 * Handles transformation between:
 * - Backend-aligned models (UserModel + ProfileModel)
 * - Legacy UserProfileModel (merged)
 * - View models for UI convenience
 */

import type { UserModel, UserRole } from "@/models/user";
import type { ProfileModel, UserProfileModel, UserProfileViewModel } from "@/models/user-profile";
import { composeUserProfileViewModel } from "@/lib/view-models/user-profile-view-model";

/**
 * Transform legacy UserProfileModel to UserModel + ProfileModel
 * (Migration helper - can be removed after full migration)
 */
export function transformLegacyUserProfileToBackendModels(
  legacy: UserProfileModel
): { user: UserModel; profile?: ProfileModel } {
  // Split fullName into firstName and lastName
  const nameParts = legacy.fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Create UserModel from legacy data
  const user: UserModel = {
    id: legacy.id,
    email: legacy.email,
    role: "Seeker" as UserRole, // Default, should come from backend
    firstName,
    lastName,
    phone: legacy.phone,
    location: legacy.location,
    isVerified: false, // Default, should come from backend
    savedJobPosts: [], // Default, should come from backend
  };

  // Create ProfileModel from legacy data (if CV exists)
  const profile: ProfileModel | undefined = legacy.cvUploaded
    ? {
        id: `${legacy.id}_profile`, // Generate ID
        user: legacy.id,
        cv: undefined, // CV URL not available in legacy model
        experience: 0, // Default, should come from backend
        qualification: 0, // Default, should come from backend
        skill: 0, // Default, should come from backend
      }
    : undefined;

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
  // If already a UserModel, return as-is
  if (data.role && data.firstName && data.lastName) {
    return data as UserModel;
  }

  // If legacy UserProfileModel, transform it
  if (data.fullName && !data.firstName) {
    const { user } = transformLegacyUserProfileToBackendModels(data as UserProfileModel);
    return user;
  }

  // Default fallback
  return {
    id: data.id || "",
    email: data.email || "",
    role: (data.role || "Seeker") as UserRole,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phone: data.phone || "",
    location: data.location || "",
    isVerified: data.isVerified || false,
    savedJobPosts: data.savedJobPosts || [],
  };
}

/**
 * Normalize profile data from various sources
 */
export function normalizeProfileData(data: any, userId: string): ProfileModel | undefined {
  if (!data) return undefined;

  return {
    id: data.id || `${userId}_profile`,
    user: userId,
    cv: data.cv || data.cvUrl || undefined,
    experience: typeof data.experience === "number" ? data.experience : 0,
    qualification: typeof data.qualification === "number" ? data.qualification : 0,
    skill: typeof data.skill === "number" ? data.skill : 0,
    matchingData: data.matchingData || undefined,
  };
}
