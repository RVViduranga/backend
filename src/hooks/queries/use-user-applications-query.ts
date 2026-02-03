/**
 * useUserApplicationsQuery Hook
 * TanStack Query hook for fetching user's job applications
 *
 * Replaces manual applications loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/user';
import type { UserApplicationModel } from '@/models/user-applications';

interface UseUserApplicationsQueryOptions {
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

interface UseUserApplicationsQueryReturn {
  /**
   * Array of user applications
   */
  applications: UserApplicationModel[];
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
 * TanStack Query hook for fetching user's job applications
 *
 * @param options - Query options including authentication status
 * @returns User applications data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { applications, isLoading, isError } = useUserApplicationsQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 * });
 * ```
 */
export function useUserApplicationsQuery({
  isAuthenticated,
  userType,
  enabled = true,
}: UseUserApplicationsQueryOptions): UseUserApplicationsQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'user';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<UserApplicationModel[]>({
    queryKey: ['user', 'applications'],
    queryFn: () => userService.getApplications(),
    enabled: shouldFetch,
    // Stale time: applications change when user applies or status updates
    staleTime: 30 * 1000, // 30 seconds
    // Retry failed requests once
    retry: 1,
  });

  return {
    applications: data ?? [],
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
