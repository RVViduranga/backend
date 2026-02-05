/**
 * useCompanyDetailQuery Hook
 * TanStack Query hook for fetching a single company's detail by ID
 *
 * Replaces manual useCompanyDetail hook with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import companyService from '@/services/company';
import type { CompanyDetailModel } from '@/models/companies';

interface UseCompanyDetailQueryOptions {
  /**
   * Company ID to fetch
   */
  companyId: string | undefined;
  /**
   * Enable/disable the query
   * @default true (automatically disabled if companyId is missing)
   */
  enabled?: boolean;
}

interface UseCompanyDetailQueryReturn {
  /**
   * Company detail data
   */
  company: CompanyDetailModel | null;
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
 * TanStack Query hook for fetching a single company's detail by ID
 *
 * @param options - Query options including company ID
 * @returns Company detail data and query state
 *
 * @example
 * ```tsx
 * const { id } = useParams<{ id: string }>();
 * const { company, isLoading, isError } = useCompanyDetailQuery({
 *   companyId: id,
 * });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (isError) return <div>Error loading company</div>;
 * if (!company) return <div>Company not found</div>;
 *
 * return <div>{company.name}</div>;
 * ```
 */
export function useCompanyDetailQuery({
  companyId,
  enabled = true,
}: UseCompanyDetailQueryOptions): UseCompanyDetailQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<CompanyDetailModel>({
    queryKey: ['company', companyId, 'detail'],
    queryFn: () => {
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      return companyService.getCompanyById(companyId);
    },
    enabled: enabled && !!companyId,
    // Stale time: company details don't change frequently
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Retry failed requests once
    retry: 1,
  });

  return {
    company: data ?? null,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
