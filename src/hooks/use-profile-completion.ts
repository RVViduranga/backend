import { useMemo, useState, useEffect } from 'react';
import { useUser } from './use-user-context';
import { userService } from '@/services/user';
import type { UserProfileModel } from '@/models/profiles';

/**
 * Calculate profile completion percentage
 * 
 * Fields counted (9 total):
 * - fullName
 * - email
 * - phone
 * - location
 * - headline
 * - experience (at least one item)
 * - education (at least one item)
 * - primary CV (at least one CV marked as primary)
 * - primary profile photo (at least one photo marked as primary)
 * 
 * Note: Projects & Work Samples are NOT included in the calculation
 * 
 * @returns Profile completion percentage (0-100)
 */
export function useProfileCompletion(): number {
  const { profile } = useUser();
  const [hasPrimaryCV, setHasPrimaryCV] = useState<boolean>(false);
  const [hasPrimaryPhoto, setHasPrimaryPhoto] = useState<boolean>(false);

  // Load primary CV status
  useEffect(() => {
    const loadPrimaryCV = async () => {
      try {
        const cvs = await userService.getCVs();
        const primaryCV = cvs.find(cv => cv.isPrimary);
        setHasPrimaryCV(!!primaryCV);
      } catch (error) {
        setHasPrimaryCV(false);
      }
    };
    loadPrimaryCV();
  }, [profile?.cvUploaded]);

  // Load primary photo status
  useEffect(() => {
    const loadPrimaryPhoto = async () => {
      try {
        const photos = await userService.getProfilePhotos();
        const primaryPhoto = photos.find(photo => photo.isPrimary);
        setHasPrimaryPhoto(!!primaryPhoto);
      } catch (error) {
        setHasPrimaryPhoto(false);
      }
    };
    loadPrimaryPhoto();
  }, [profile?.avatarUrl]);

  return useMemo(() => {
    if (!profile) return 0;
    
    let completedFields = 0;
    const totalFields = 9; // fullName, email, phone, location, headline, experience, education, primaryCV, primaryPhoto

    if (profile.fullName) completedFields++;
    if (profile.email) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.location) completedFields++;
    if (profile.headline) completedFields++;
    if (profile.experience && profile.experience.length > 0) completedFields++;
    if (profile.education && profile.education.length > 0) completedFields++;
    if (hasPrimaryCV) completedFields++;
    if (hasPrimaryPhoto) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }, [profile, hasPrimaryCV, hasPrimaryPhoto]);
}

/**
 * Calculate profile completion from a profile object directly
 * Useful for components that don't use the useUser hook
 * 
 * Fields counted (9 total):
 * - fullName
 * - email
 * - phone
 * - location
 * - headline
 * - experience (at least one item)
 * - education (at least one item)
 * - cvUploaded (fallback check, but should use primary CV for accurate calculation)
 * - avatarUrl (fallback check, but should use primary photo for accurate calculation)
 * 
 * Note: 
 * - Projects & Work Samples are NOT included in the calculation
 * - This function uses cvUploaded and avatarUrl as fallbacks
 * - For accurate calculation with primary CV/photo, use useProfileCompletion hook instead
 */
export function calculateProfileCompletion(profile: UserProfileModel | null | undefined): number {
  if (!profile) return 0;
  
  let completedFields = 0;
  const totalFields = 9; // fullName, email, phone, location, headline, experience, education, cvUploaded, avatarUrl

  if (profile.fullName) completedFields++;
  if (profile.email) completedFields++;
  if (profile.phone) completedFields++;
  if (profile.location) completedFields++;
  if (profile.headline) completedFields++;
  if (profile.experience && profile.experience.length > 0) completedFields++;
  if (profile.education && profile.education.length > 0) completedFields++;
  if (profile.cvUploaded) completedFields++; // Fallback: use cvUploaded flag
  if (profile.avatarUrl) completedFields++; // Fallback: use avatarUrl flag

  return Math.round((completedFields / totalFields) * 100);
}
