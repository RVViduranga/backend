/**
 * useUserProfileQuery Hook
 * TanStack Query hook for fetching user profile
 *
 * Replaces manual profile loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/user';
import type { UserProfileModel } from '@/models/profiles';

interface UseUserProfileQueryOptions {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * User type - only fetch if user type is "user"
   */
  userType?: 'user' | 'company';
  /**
   * Enable/disable the query
   * @default true (automatically disabled if not authenticated or wrong user type)
   */
  enabled?: boolean;
}

interface UseUserProfileQueryReturn {
  /**
   * User profile data
   */
  profile: UserProfileModel | null;
  /**
   * Whether the query is loading for the first time
   */
  isLoading: boolean;
  /**
   * Whether the query is fetching (including background refetches)
   */
  isFetching: boolean;
  /**
   * Whether the query encountered an error
   */
  isError: boolean;
  /**
   * Error object if the query failed
   */
  error: Error | null;
  /**
   * Manually refetch the query
   */
  refetch: () => void;
}

/**
 * TanStack Query hook for fetching user profile
 *
 * @param options - Query options including authentication status
 * @returns User profile data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { profile, isLoading, isError } = useUserProfileQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 * });
 * ```
 */
export function useUserProfileQuery({
  isAuthenticated,
  userType,
  enabled = true,
}: UseUserProfileQueryOptions): UseUserProfileQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'user';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<UserProfileModel>({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
    enabled: shouldFetch,
    // Stale time: profile doesn't change frequently
    staleTime: 2 * 60 * 1000, // 2 minutes
    // Retry failed requests once
    retry: 1,
  });

  return {
    profile: data ?? null,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
