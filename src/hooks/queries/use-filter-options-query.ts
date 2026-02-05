/**
 * useFilterOptionsQuery Hook
 * TanStack Query hook for fetching job filter options
 *
 * Fetches available filter options (locations, industries, experience levels, job types)
 * Falls back to constants if service unavailable
 */
import { useQuery } from '@tanstack/react-query';
import jobService, { type FilterOptionsResponse } from '@/services/job';
import {
  LOCATION_OPTIONS,
  INDUSTRY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_TYPE_OPTIONS,
} from '@/constants/job-forms';

interface UseFilterOptionsQueryReturn {
  /**
   * Filter options data
   */
  filterOptions: FilterOptionsResponse | null;
  /**
   * Whether the query is currently loading
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
 * TanStack Query hook for fetching job filter options
 *
 * @returns Filter options data and query state
 *
 * @example
 * ```tsx
 * const { filterOptions, isLoading } = useFilterOptionsQuery();
 * 
 * const locations = filterOptions?.locations || [...LOCATION_OPTIONS];
 * ```
 */
export function useFilterOptionsQuery(): UseFilterOptionsQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: queryRefetch,
  } = useQuery<FilterOptionsResponse>({
    queryKey: ['jobs', 'filter-options'],
    queryFn: () => jobService.getFilterOptions(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour (filter options don't change often)
    retry: 1, // Retry once on failure
    // Fallback to constants if service fails
    placeholderData: {
      locations: [...LOCATION_OPTIONS],
      industries: [...INDUSTRY_OPTIONS],
      experienceLevels: [...EXPERIENCE_LEVEL_OPTIONS],
      jobTypes: [...JOB_TYPE_OPTIONS],
    },
  });

  return {
    filterOptions: data ?? null,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
