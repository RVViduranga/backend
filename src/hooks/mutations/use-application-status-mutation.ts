/**
 * useApplicationStatusMutation Hook
 * TanStack Query mutation hook for updating application status
 *
 * Handles application status updates with automatic query invalidation
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import companyService from '@/services/company';
import { logger } from '@/lib/logger';
import type { ApplicationModel } from '@/models/applications';

interface UseApplicationStatusMutationReturn {
  /**
   * Update application status
   */
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationModel['status']
  ) => Promise<ApplicationModel>;
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
 * TanStack Query mutation hook for updating application status
 *
 * Automatically invalidates the company applications query on success to refresh the list
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { updateApplicationStatus, isPending } = useApplicationStatusMutation();
 *
 * const handleStatusChange = async () => {
 *   try {
 *     await updateApplicationStatus(applicationId, 'interview');
 *     toast.success('Application status updated!');
 *   } catch (error) {
 *     toast.error('Failed to update status');
 *   }
 * };
 * ```
 */
export function useApplicationStatusMutation(): UseApplicationStatusMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: ApplicationModel['status'];
    }) => companyService.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      // Invalidate and refetch company applications query after successful update
      queryClient.invalidateQueries({ queryKey: ['company', 'applications'] });
      logger.info('Application status updated successfully');
    },
    onError: (err) => {
      logger.error('Error updating application status:', err);
    },
  });

  return {
    updateApplicationStatus: async (
      applicationId: string,
      status: ApplicationModel['status']
    ) => {
      return await mutation.mutateAsync({ applicationId, status });
    },
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
  };
}
