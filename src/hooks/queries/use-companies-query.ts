/**
 * useCompaniesQuery Hook
 * TanStack Query hook for fetching companies list with filters and pagination
 *
 * Replaces manual useCompanies hook with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import companyService, {
  type CompanyListParams,
  type CompanyListResponse,
} from '@/services/company';

interface UseCompaniesQueryOptions {
  /**
   * Query parameters (search, industry, pagination, etc.)
   */
  params?: CompanyListParams;
  /**
   * Enable/disable the query
   * @default true
   */
  enabled?: boolean;
}

interface UseCompaniesQueryReturn {
  /**
   * Array of companies
   */
  companies: CompanyListResponse['companies'];
  /**
   * Total number of companies
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
 * TanStack Query hook for fetching companies list with filters and pagination
 *
 * @param options - Query options including params
 * @returns Companies list data and query state
 *
 * @example
 * ```tsx
 * const { companies, isLoading, total } = useCompaniesQuery({
 *   params: {
 *     search: 'tech',
 *     industry: 'Information Technology',
 *     page: 1,
 *     limit: 20
 *   }
 * });
 * ```
 */
export function useCompaniesQuery({
  params,
  enabled = true,
}: UseCompaniesQueryOptions = {}): UseCompaniesQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<CompanyListResponse>({
    queryKey: ['companies', 'list', params],
    queryFn: () => companyService.getAllCompanies(params),
    enabled,
    placeholderData: (previousData) => previousData ?? undefined,
    // Keep previous data while fetching new data for smooth pagination
    // Stale time: companies list changes moderately
    staleTime: 2 * 60 * 1000, // 2 minutes
    // Retry failed requests once
    retry: 1,
  });

  return {
    companies: data?.companies ?? [],
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
