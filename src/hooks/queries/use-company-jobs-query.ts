/**
 * useCompanyJobsQuery Hook
 * TanStack Query hook for fetching company's posted jobs
 *
 * Replaces manual jobs loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import companyService, { type CompanyJobsParams, type CompanyJobsResponse } from '@/services/company';

interface UseCompanyJobsQueryOptions {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * User type - only fetch if user type is "company"
   */
  userType?: 'user' | 'company';
  /**
   * Optional query parameters (status, pagination, etc.)
   */
  params?: CompanyJobsParams;
  /**
   * Enable/disable the query
   * @default true (automatically disabled if not authenticated or wrong user type)
   */
  enabled?: boolean;
}

interface UseCompanyJobsQueryReturn {
  /**
   * Array of job postings
   */
  jobs: CompanyJobsResponse['jobs'];
  /**
   * Total number of jobs
   */
  total: number;
  /**
   * Current page number
   */
  page: number;
  /**
   * Number of results per page
   */
  limit: number;
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
 * TanStack Query hook for fetching company's posted jobs
 *
 * @param options - Query options including authentication status and params
 * @returns Company jobs data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { jobs, isLoading, isError } = useCompanyJobsQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 *   params: { status: 'Active' },
 * });
 * ```
 */
export function useCompanyJobsQuery({
  isAuthenticated,
  userType,
  params,
  enabled = true,
}: UseCompanyJobsQueryOptions): UseCompanyJobsQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'company';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<CompanyJobsResponse>({
    queryKey: ['company', 'jobs', params],
    queryFn: () => companyService.getJobs(params),
    enabled: shouldFetch,
    // Stale time: jobs list changes more frequently
    staleTime: 1 * 60 * 1000, // 1 minute
    // Retry failed requests once
    retry: 1,
  });

  return {
    jobs: data?.jobs ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? params?.page ?? 1,
    limit: data?.limit ?? params?.limit ?? 20,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
