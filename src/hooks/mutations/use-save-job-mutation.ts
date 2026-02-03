/**
 * useSaveJobMutation Hook
 * TanStack Query mutation hook for saving/unsaving jobs
 *
 * Handles both save and unsave operations with automatic query invalidation
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/services/user';
import { logger } from '@/lib/logger';

interface UseSaveJobMutationReturn {
  /**
   * Save a job
   */
  saveJob: (jobId: string) => Promise<void>;
  /**
   * Unsave a job
   */
  unsaveJob: (jobId: string) => Promise<void>;
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
 * TanStack Query mutation hook for saving/unsaving jobs
 *
 * Automatically invalidates the saved jobs query on success to refresh the list
 *
 * @returns Mutation functions and state
 *
 * @example
 * ```tsx
 * const { saveJob, unsaveJob, isPending } = useSaveJobMutation();
 *
 * const handleSave = async () => {
 *   try {
 *     await saveJob(jobId);
 *     toast.success('Job saved!');
 *   } catch (error) {
 *     toast.error('Failed to save job');
 *   }
 * };
 * ```
 */
export function useSaveJobMutation(): UseSaveJobMutationReturn {
  const queryClient = useQueryClient();

  // Save job mutation
  const saveMutation = useMutation({
    mutationFn: (jobId: string) => userService.saveJob(jobId),
    onSuccess: () => {
      // Invalidate and refetch saved jobs query after successful save
      queryClient.invalidateQueries({ queryKey: ['user', 'saved-jobs'] });
      logger.info('Job saved successfully');
    },
    onError: (err) => {
      logger.error('Error saving job:', err);
    },
  });

  // Unsave job mutation
  const unsaveMutation = useMutation({
    mutationFn: (jobId: string) => userService.unsaveJob(jobId),
    onSuccess: () => {
      // Invalidate and refetch saved jobs query after successful unsave
      queryClient.invalidateQueries({ queryKey: ['user', 'saved-jobs'] });
      logger.info('Job unsaved successfully');
    },
    onError: (err) => {
      logger.error('Error unsaving job:', err);
    },
  });

  return {
    saveJob: async (jobId: string) => {
      await saveMutation.mutateAsync(jobId);
    },
    unsaveJob: async (jobId: string) => {
      await unsaveMutation.mutateAsync(jobId);
    },
    isPending: saveMutation.isPending || unsaveMutation.isPending,
    error: (saveMutation.error || unsaveMutation.error) as Error | null,
  };
}
