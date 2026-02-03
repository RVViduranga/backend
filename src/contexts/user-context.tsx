/**
 * User Context
 * Provides user profile data and operations globally
 *
 * Architecture: Context → TanStack Query → Service → API/Mock
 * Uses TanStack Query for data fetching with automatic caching and refetching
 */
import React, {
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-context";
import { useUserProfileQuery } from "@/hooks/queries/use-user-profile-query";
import userService from "@/services/user";
import { logger } from "@/lib/logger";
import { ERROR_MESSAGES } from "@/constants";
import type { UserProfileModel } from "@/models/user-profile";

interface UserContextType {
  profile: UserProfileModel | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfileModel>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Use TanStack Query hook for fetching user profile
  const {
    profile,
    isLoading,
    isError,
    error: queryError,
    refetch: refetchProfile,
  } = useUserProfileQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Convert query error to string for backward compatibility
  const error = useMemo(() => {
    if (isError && queryError) {
      return queryError instanceof Error
        ? queryError.message
        : ERROR_MESSAGES.PROFILE_LOAD_FAILED;
    }
    return null;
  }, [isError, queryError]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<UserProfileModel>) =>
      userService.updateProfile(updates),
    onSuccess: () => {
      // Invalidate and refetch user profile query after successful update
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      logger.info('User profile updated successfully');
    },
    onError: (err) => {
      logger.error('Error updating user profile:', err);
    },
  });

  const updateProfile = useCallback(
    async (updates: Partial<UserProfileModel>) => {
      try {
        await updateProfileMutation.mutateAsync(updates);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : ERROR_MESSAGES.PROFILE_UPDATE_FAILED;
        logger.error('Error updating user profile:', err);
        throw new Error(errorMessage);
      }
    },
    [updateProfileMutation]
  );

  const refreshProfile = useCallback(async () => {
    await refetchProfile();
  }, [refetchProfile]);

  // Memoize context value to prevent unnecessary re-renders
  const value: UserContextType = useMemo(
    () => ({
      profile,
      isLoading,
      error,
      updateProfile,
      refreshProfile,
    }),
    [profile, isLoading, error, updateProfile, refreshProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}


