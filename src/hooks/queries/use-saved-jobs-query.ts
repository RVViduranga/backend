/**
 * useSavedJobsQuery Hook
 * TanStack Query hook for fetching user's saved jobs
 *
 * Replaces manual saved jobs loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import userService from '@/services/user';
import type { JobSummaryModel } from '@/models/job';

interface UseSavedJobsQueryOptions {
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

interface UseSavedJobsQueryReturn {
  /**
   * Array of saved jobs
   */
  savedJobs: JobSummaryModel[];
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
 * TanStack Query hook for fetching user's saved jobs
 *
 * @param options - Query options including authentication status
 * @returns Saved jobs data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { savedJobs, isLoading, isError } = useSavedJobsQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 * });
 * ```
 */
export function useSavedJobsQuery({
  isAuthenticated,
  userType,
  enabled = true,
}: UseSavedJobsQueryOptions): UseSavedJobsQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'user';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<JobSummaryModel[]>({
    queryKey: ['user', 'saved-jobs'],
    queryFn: () => userService.getSavedJobs(),
    enabled: shouldFetch,
    // Stale time: saved jobs change when user saves/unsaves
    staleTime: 1 * 60 * 1000, // 1 minute
    // Retry failed requests once
    retry: 1,
  });

  return {
    savedJobs: data ?? [],
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
