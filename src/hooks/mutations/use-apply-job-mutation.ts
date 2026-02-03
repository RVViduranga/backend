/**
 * useApplyJobMutation Hook
 * TanStack Query mutation hook for applying to jobs
 *
 * Handles job application submission with automatic query invalidation
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import jobService, {
  type JobApplicationData,
  type JobApplicationResponse,
} from '@/services/job';
import { logger } from '@/lib/logger';

interface UseApplyJobMutationReturn {
  /**
   * Apply for a job
   */
  applyForJob: (data: JobApplicationData) => Promise<JobApplicationResponse>;
  /**
   * Whether the mutation is in progress
   */
  isPending: boolean;
  /**
   * Error object if the mutation failed
   */
  error: Error | null;
}

/**
 * TanStack Query mutation hook for applying to jobs
 *
 * Automatically invalidates user applications and job detail queries on success
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { applyForJob, isPending } = useApplyJobMutation();
 *
 * const handleApply = async () => {
 *   try {
 *     const response = await applyForJob({
 *       jobId: 'job-123',
 *       fullName: 'John Doe',
 *       email: 'john@example.com',
 *       phone: '1234567890',
 *       coverLetter: 'I am interested...',
 *       resumeFile: file,
 *     });
 *     toast.success('Application submitted!');
 *   } catch (error) {
 *     toast.error('Failed to submit application');
 *   }
 * };
 * ```
 */
export function useApplyJobMutation(): UseApplyJobMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: JobApplicationData) => jobService.applyForJob(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch user applications query after successful application
      queryClient.invalidateQueries({ queryKey: ['user', 'applications'] });
      // Invalidate the specific job query to refresh job details (application count, etc.)
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      logger.info('Job application submitted successfully');
    },
    onError: (err) => {
      logger.error('Error applying for job:', err);
    },
  });

  return {
    applyForJob: async (data: JobApplicationData) => {
      return await mutation.mutateAsync(data);
    },
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
  };
}
