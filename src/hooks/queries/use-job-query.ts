/**
 * useJobQuery Hook
 * TanStack Query hook for fetching a single job by ID
 *
 * Replaces manual useJob hook with automatic caching, refetching, and state management
 */
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services';
import type { JobDetailModel } from '@/models/jobPosts';

interface UseJobQueryOptions {
  /**
   * Job ID to fetch
   */
  jobId: string | undefined;
  /**
   * Enable/disable the query
   * @default true (automatically disabled if jobId is missing)
   */
  enabled?: boolean;
}

interface UseJobQueryReturn {
  /**
   * Job detail data
   */
  job: JobDetailModel | null;
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
 * TanStack Query hook for fetching a single job by ID
 *
 * @param options - Query options including job ID
 * @returns Job data and query state
 *
 * @example
 * ```tsx
 * const { id } = useParams<{ id: string }>();
 * const { job, isLoading, isError } = useJobQuery({ jobId: id });
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (isError) return <div>Error loading job</div>;
 * if (!job) return <div>Job not found</div>;
 *
 * return <div>{job.title}</div>;
 * ```
 */
export function useJobQuery({
  jobId,
  enabled = true,
}: UseJobQueryOptions): UseJobQueryReturn {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: queryRefetch,
  } = useQuery<JobDetailModel>({
    queryKey: ['job', jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error('Job ID is required');
      }
      return jobService.getJobById(jobId);
    },
    enabled: enabled && !!jobId,
    // Stale time: job details don't change frequently
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Retry failed requests once
    retry: 1,
  });

  return {
    job: data ?? null,
    isLoading,
    isFetching,
    isError,
    error: error as Error | null,
    refetch: () => {
      queryRefetch();
    },
  };
}
