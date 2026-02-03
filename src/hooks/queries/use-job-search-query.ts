/**
 * useJobSearchQuery Hook
 * TanStack Query hook for job search operations
 *
 * Replaces manual useJobSearch hook with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import jobService, { type JobSearchParams, type JobSearchResponse } from '@/services/job';

interface UseJobSearchQueryOptions {
  /**
   * Job search parameters (query, filters, pagination, etc.)
   */
  params: JobSearchParams;
  /**
   * Enable/disable the query
   * @default true
   */
  enabled?: boolean;
}

interface UseJobSearchQueryReturn {
  /**
   * Array of job search results
   */
  searchResults: JobSearchResponse['jobs'];
  /**
   * Total number of jobs matching the search
   */
  searchTotal: number;
  /**
   * Current page number
   */
  page: number;
  /**
   * Number of results per page
   */
  limit: number;
  /**
   * Total number of pages
   */
  totalPages: number;
  /**
   * Whether the query is currently fetching
   */
  isSearching: boolean;
  /**
   * Whether the query is loading for the first time
   */
  isLoading: boolean;
  /**
   * Whether the query is fetching in the background
   */
  isFetching: boolean;
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
 * TanStack Query hook for searching jobs with filters and pagination
 *
 * @param options - Query options including search parameters
 * @returns Job search results and query state
 *
 * @example
 * ```tsx
 * const { searchResults, isSearching, searchTotal } = useJobSearchQuery({
 *   params: {
 *     query: 'developer',
 *     location: ['Colombo'],
 *     page: 1,
 *     limit: 20
 *   }
 * });
 * ```
 */
export function useJobSearchQuery({
  params,
  enabled = true,
}: UseJobSearchQueryOptions): UseJobSearchQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: queryRefetch,
  } = useQuery<JobSearchResponse>({
    queryKey: ['jobs', 'search', params],
    queryFn: () => jobService.searchJobs(params),
    enabled,
    placeholderData: (previousData) => previousData ?? undefined,
    // Keep previous data while fetching new data for smooth pagination
  });

  return {
    searchResults: data?.jobs ?? [],
    searchTotal: data?.total ?? 0,
    page: data?.page ?? params.page ?? 1,
    limit: data?.limit ?? params.limit ?? 20,
    totalPages: data?.totalPages ?? 0,
    isSearching: isLoading || isFetching,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
