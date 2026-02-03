/**
 * usePlatformStatisticsQuery Hook
 * TanStack Query hook for fetching platform statistics
 *
 * Replaces manual platform statistics loading with automatic caching and refetching
 */
import { useQuery } from '@tanstack/react-query';
import { getPlatformStatistics, type PlatformStatistics } from '@/services/analytics';

interface UsePlatformStatisticsQueryReturn {
  /**
   * Platform statistics data
   */
  statistics: PlatformStatistics;
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
 * TanStack Query hook for fetching platform statistics
 *
 * Uses fallback mock data if API fails, ensuring the app always has statistics to display
 *
 * @returns Platform statistics data and query state
 *
 * @example
 * ```tsx
 * const { statistics, isLoading } = usePlatformStatisticsQuery();
 *
 * if (isLoading) return <div>Loading...</div>;
 *
 * return <div>{statistics.activeJobs} Active Jobs</div>;
 * ```
 */
export function usePlatformStatisticsQuery(): UsePlatformStatisticsQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<PlatformStatistics>({
    queryKey: ['platform', 'statistics'],
    queryFn: () => getPlatformStatistics(), // Service handles all fallback logic
    // Long stale time since statistics don't change frequently
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Cache time: keep in cache for 10 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Retry failed requests once
    retry: 1,
  });

  // Service always returns data (handles fallback internally)
  // So data should never be undefined, but provide fallback for type safety
  const defaultStats: PlatformStatistics = {
    activeJobs: '0',
    companies: '0',
    jobSeekers: '0',
    newJobsDaily: '0',
  };

  return {
    statistics: data ?? defaultStats,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
