/**
 * User Profile View Model Composer
 * 
 * Transforms backend UserModel + ProfileModel into UserProfileViewModel
 * for UI convenience while maintaining backend alignment.
 */

import type { UserModel } from "@/models/user";
import type { ProfileModel, UserProfileViewModel, EducationModel, ExperienceModel } from "@/models/user-profile";

/**
 * Compose UserProfileViewModel from UserModel and ProfileModel
 * 
 * @param user - UserModel from backend
 * @param profile - ProfileModel from backend (optional)
 * @param education - Education array (optional, from separate endpoint)
 * @param experienceHistory - Experience array (optional, from separate endpoint)
 * @returns UserProfileViewModel for UI components
 */
export function composeUserProfileViewModel(
  user: UserModel,
  profile?: ProfileModel,
  education?: EducationModel[],
  experienceHistory?: ExperienceModel[]
): UserProfileViewModel {
  // Compute fullName from firstName + lastName
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  
  // Compute displayName (fallback to email if name is empty)
  const displayName = fullName || user.email;
  
  // Compute profileCompletion (0-100)
  const profileCompletion = calculateProfileCompletion(user, profile);
  
  // Compute cvUploaded from profile.cv existence
  const cvUploaded = !!profile?.cv;
  
  return {
    user,
    profile,
    fullName,
    displayName,
    profileCompletion,
    education: education || [],
    experienceHistory: experienceHistory || [],
    cvUploaded,
    // UI-specific fields (can be populated from profile or user)
    headline: undefined, // May come from profile or separate field
    avatarUrl: undefined, // May come from profile or user
  };
}

/**
 * Calculate profile completion percentage (0-100)
 * 
 * @param user - UserModel
 * @param profile - ProfileModel (optional)
 * @returns Completion percentage (0-100)
 */
function calculateProfileCompletion(user: UserModel, profile?: ProfileModel): number {
  let completedFields = 0;
  const totalFields = 8; // Adjust based on required fields
  
  // User fields
  if (user.firstName) completedFields++;
  if (user.lastName) completedFields++;
  if (user.email) completedFields++;
  if (user.phone) completedFields++;
  if (user.location) completedFields++;
  
  // Profile fields
  if (profile?.cv) completedFields++;
  if (profile?.experience !== undefined && profile.experience > 0) completedFields++;
  if (profile?.qualification !== undefined && profile.qualification > 0) completedFields++;
  if (profile?.skill !== undefined && profile.skill > 0) completedFields++;
  
  return Math.round((completedFields / totalFields) * 100);
}

/**
 * Transform legacy UserProfileModel to UserProfileViewModel
 * (Migration helper - can be removed after full migration)
 * 
 * @deprecated Use composeUserProfileViewModel instead
 */
export function transformLegacyUserProfileModel(
  legacy: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    headline: string;
    location: string;
    avatarUrl: string;
    cvUploaded: boolean;
    education: EducationModel[];
    experience: ExperienceModel[];
  }
): UserProfileViewModel {
  // Split fullName into firstName and lastName
  const nameParts = legacy.fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  
  // Create UserModel from legacy data
  const user: UserModel = {
    id: legacy.id,
    email: legacy.email,
    role: "Seeker", // Default, should come from backend
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
  
  return composeUserProfileViewModel(
    user,
    profile,
    legacy.education,
    legacy.experience
  );
}
