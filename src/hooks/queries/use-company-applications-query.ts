/**
 * useCompanyApplicationsQuery Hook
 * TanStack Query hook for fetching company's received applications
 *
 * Replaces manual applications loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import companyService, {
  type CompanyApplicationsParams,
  type CompanyApplicationsResponse,
} from '@/services/company';

interface UseCompanyApplicationsQueryOptions {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * User type - only fetch if user type is "company"
   */
  userType?: 'user' | 'company';
  /**
   * Optional query parameters (jobId, status, pagination, etc.)
   */
  params?: CompanyApplicationsParams;
  /**
   * Enable/disable the query
   * @default true (automatically disabled if not authenticated or wrong user type)
   */
  enabled?: boolean;
}

interface UseCompanyApplicationsQueryReturn {
  /**
   * Array of applications
   */
  applications: CompanyApplicationsResponse['applications'];
  /**
   * Total number of applications
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
 * TanStack Query hook for fetching company's received applications
 *
 * @param options - Query options including authentication status and params
 * @returns Company applications data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { applications, isLoading, isError } = useCompanyApplicationsQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 *   params: { status: 'pending' },
 * });
 * ```
 */
export function useCompanyApplicationsQuery({
  isAuthenticated,
  userType,
  params,
  enabled = true,
}: UseCompanyApplicationsQueryOptions): UseCompanyApplicationsQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'company';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<CompanyApplicationsResponse>({
    queryKey: ['company', 'applications', params],
    queryFn: () => companyService.getApplications(params),
    enabled: shouldFetch,
    // Stale time: applications change frequently
    staleTime: 30 * 1000, // 30 seconds
    // Retry failed requests once
    retry: 1,
  });

  return {
    applications: data?.applications ?? [],
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
