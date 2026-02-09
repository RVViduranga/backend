/**
 * User Profile View Model Composer
 * 
 * Transforms backend UserModel + ProfileModel into UserProfileViewModel
 * for UI convenience while maintaining backend alignment.
 */

import type { UserModel } from "@/models/users";
import type { ProfileModel, UserProfileViewModel } from "@/models/profiles";
import type { EducationModel } from "@/models/education";
import type { ExperienceModel } from "@/models/experience";

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
  // Backend UserModel already has fullName
  const fullName = user.fullName || "";
  
  // Compute displayName (fallback to email if name is empty)
  const displayName = fullName || user.email;
  
  // Compute profileCompletion (0-100)
  const profileCompletion = calculateProfileCompletion(user, profile);
  
  // Compute cvUploaded from profile.cvUploaded field
  const cvUploaded = profile?.cvUploaded || false;
  
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
    headline: profile?.headline,
    avatarUrl: profile?.avatarUrl,
  };
}

/**
 * Calculate profile completion percentage (0-100)
 * 
 * Note: Projects & Work Samples are NOT included in the calculation
 * 
 * @param user - UserModel
 * @param profile - ProfileModel (optional)
 * @returns Completion percentage (0-100)
 */
function calculateProfileCompletion(user: UserModel, profile?: ProfileModel): number {
  let completedFields = 0;
  const totalFields = 7; // fullName, email, phone, location, headline, education, experience
  
  // User fields
  if (user.fullName) completedFields++; // ✅ Backend uses fullName
  if (user.email) completedFields++;
  
  // Profile fields
  if (profile?.phone) completedFields++;
  if (profile?.location) completedFields++;
  if (profile?.headline) completedFields++;
  if (profile?.education && profile.education.length > 0) completedFields++;
  if (profile?.experience && profile.experience.length > 0) completedFields++;
  
  // Note: CV and Photo are not included here as they require checking for primary status
  // Use useProfileCompletion hook for accurate calculation including primary CV/photo
  
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
  // Backend UserModel uses fullName directly
  // Create UserModel from legacy data
  const user: UserModel = {
    id: legacy.id,
    fullName: legacy.fullName, // ✅ Backend uses fullName
    email: legacy.email,
  };
  
  // Create ProfileModel from legacy data (if CV exists)
  const profile: ProfileModel | undefined = legacy.cvUploaded
    ? {
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
        cvs: [], // Legacy doesn't have cvs array
        mediaFiles: [], // Legacy doesn't have mediaFiles
        projects: [], // Legacy doesn't have projects
      }
    : undefined;
  
  return composeUserProfileViewModel(
    user,
    profile,
    legacy.education,
    legacy.experience
  );
}
