/**
 * useCompanyProfileQuery Hook
 * TanStack Query hook for fetching company profile
 *
 * Replaces manual profile loading with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import companyService from '@/services/company';
import type { CompanyDetailModel, CompanySummaryModel } from '@/models/company';

interface CompanyProfileResponse {
  profile: CompanyDetailModel;
  summary: CompanySummaryModel;
}

interface UseCompanyProfileQueryOptions {
  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;
  /**
   * User type - only fetch if user type is "company"
   */
  userType?: 'user' | 'company';
  /**
   * Enable/disable the query
   * @default true (automatically disabled if not authenticated or wrong user type)
   */
  enabled?: boolean;
}

interface UseCompanyProfileQueryReturn {
  /**
   * Company profile detail data
   */
  profile: CompanyDetailModel | null;
  /**
   * Company summary data
   */
  summary: CompanySummaryModel | null;
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
 * TanStack Query hook for fetching company profile
 *
 * @param options - Query options including authentication status
 * @returns Company profile data and query state
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user } = useAuth();
 * const { profile, summary, isLoading, isError } = useCompanyProfileQuery({
 *   isAuthenticated,
 *   userType: user?.userType,
 * });
 * ```
 */
export function useCompanyProfileQuery({
  isAuthenticated,
  userType,
  enabled = true,
}: UseCompanyProfileQueryOptions): UseCompanyProfileQueryReturn {
  const shouldFetch = enabled && isAuthenticated && userType === 'company';

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<CompanyProfileResponse>({
    queryKey: ['company', 'profile'],
    queryFn: () => companyService.getProfile(),
    enabled: shouldFetch,
    // Stale time: profile doesn't change frequently
    staleTime: 2 * 60 * 1000, // 2 minutes
    // Retry failed requests once
    retry: 1,
  });

  return {
    profile: data?.profile ?? null,
    summary: data?.summary ?? null,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
