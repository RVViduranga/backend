/**
 * useManageJobMutation Hook
 * TanStack Query mutation hook for managing company jobs (create, update, delete)
 *
 * Handles job CRUD operations with automatic query invalidation
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import companyService from '@/services/company';
import { logger } from '@/lib/logger';
import type { JobDetailModel, JobSummaryModel } from '@/models/job';

interface UseManageJobMutationReturn {
  /**
   * Create a new job posting
   */
  createJob: (jobData: Partial<JobDetailModel>) => Promise<JobDetailModel>;
  /**
   * Update an existing job posting
   */
  updateJob: (
    id: string,
    jobData: Partial<JobDetailModel>
  ) => Promise<JobDetailModel>;
  /**
   * Delete a job posting
   */
  deleteJob: (id: string) => Promise<void>;
  /**
   * Whether any mutation is in progress
   */
  isPending: boolean;
  /**
   * Error object if any mutation failed
   */
  error: Error | null;
}

/**
 * TanStack Query mutation hook for managing company jobs
 *
 * Automatically invalidates the company jobs query on success to refresh the list
 *
 * @returns Mutation functions and state
 *
 * @example
 * ```tsx
 * const { createJob, updateJob, deleteJob, isPending } = useManageJobMutation();
 *
 * const handleCreate = async () => {
 *   try {
 *     const newJob = await createJob(jobData);
 *     toast.success('Job created!');
 *   } catch (error) {
 *     toast.error('Failed to create job');
 *   }
 * };
 * ```
 */
export function useManageJobMutation(): UseManageJobMutationReturn {
  const queryClient = useQueryClient();

  // Create job mutation
  const createMutation = useMutation({
    mutationFn: (jobData: Partial<JobDetailModel>) =>
      companyService.createJob(jobData),
    onSuccess: () => {
      // Invalidate and refetch company jobs query after successful creation
      queryClient.invalidateQueries({ queryKey: ['company', 'jobs'] });
      logger.info('Job created successfully');
    },
    onError: (err) => {
      logger.error('Error creating job:', err);
    },
  });

  // Update job mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      jobData,
    }: {
      id: string;
      jobData: Partial<JobDetailModel>;
    }) => companyService.updateJob(id, jobData),
    onSuccess: () => {
      // Invalidate and refetch company jobs query after successful update
      queryClient.invalidateQueries({ queryKey: ['company', 'jobs'] });
      logger.info('Job updated successfully');
    },
    onError: (err) => {
      logger.error('Error updating job:', err);
    },
  });

  // Delete job mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => companyService.deleteJob(id),
    onSuccess: () => {
      // Invalidate and refetch company jobs query after successful deletion
      queryClient.invalidateQueries({ queryKey: ['company', 'jobs'] });
      logger.info('Job deleted successfully');
    },
    onError: (err) => {
      logger.error('Error deleting job:', err);
    },
  });

  return {
    createJob: async (jobData: Partial<JobDetailModel>) => {
      return await createMutation.mutateAsync(jobData);
    },
    updateJob: async (id: string, jobData: Partial<JobDetailModel>) => {
      return await updateMutation.mutateAsync({ id, jobData });
    },
    deleteJob: async (id: string) => {
      await deleteMutation.mutateAsync(id);
    },
    isPending:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: (createMutation.error ||
      updateMutation.error ||
      deleteMutation.error) as Error | null,
  };
}
