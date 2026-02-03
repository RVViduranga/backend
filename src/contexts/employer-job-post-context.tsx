/**
 * Employer Job Post Context
 * Manages job posts created by the employer
 *
 * Architecture: Context → TanStack Query → Service → API/Mock
 * Uses TanStack Query for data fetching with automatic caching and refetching
 * Used ONLY in company/employer pages
 */
import React, {
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { useCompanyJobsQuery } from "@/hooks/queries/use-company-jobs-query";
import { useManageJobMutation } from "@/hooks/mutations/use-manage-job-mutation";
import type { JobSummaryModel, JobDetailModel } from "@/models/job";

interface EmployerJobPostContextType {
  jobs: JobSummaryModel[];
  isLoading: boolean;
  error: string | null;
  createJob: (jobData: Partial<JobDetailModel>) => Promise<JobDetailModel>;
  updateJob: (id: string, jobData: Partial<JobDetailModel>) => Promise<JobDetailModel>;
  deleteJob: (id: string) => Promise<void>;
  refreshJobs: () => Promise<void>;
}

export const EmployerJobPostContext = createContext<
  EmployerJobPostContextType | undefined
>(undefined);

export function EmployerJobPostProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Use TanStack Query hook for fetching company jobs
  const {
    jobs,
    isLoading,
    isError,
    error: queryError,
    refetch: refetchJobs,
  } = useCompanyJobsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Use mutation hook for managing jobs
  const {
    createJob: createJobMutation,
    updateJob: updateJobMutation,
    deleteJob: deleteJobMutation,
    isPending: isMutationPending,
    error: mutationError,
  } = useManageJobMutation();

  // Convert query error to string for backward compatibility
  const error = useMemo(() => {
    if (isError && queryError) {
      return queryError instanceof Error ? queryError.message : null;
    }
    if (mutationError) {
      return mutationError instanceof Error ? mutationError.message : null;
    }
    return null;
  }, [isError, queryError, mutationError]);

  // Combined loading state
  const isLoadingState = isLoading || isMutationPending;

  const createJob = useCallback(
    async (jobData: Partial<JobDetailModel>): Promise<JobDetailModel> => {
      try {
        const newJob = await createJobMutation(jobData);
        // Query invalidation is handled automatically in the mutation hook
        return newJob;
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [createJobMutation]
  );

  const updateJob = useCallback(
    async (
      id: string,
      jobData: Partial<JobDetailModel>
    ): Promise<JobDetailModel> => {
      try {
        const updatedJob = await updateJobMutation(id, jobData);
        // Query invalidation is handled automatically in the mutation hook
        return updatedJob;
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [updateJobMutation]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      try {
        await deleteJobMutation(id);
        // Query invalidation is handled automatically in the mutation hook
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [deleteJobMutation]
  );

  const refreshJobs = useCallback(async () => {
    await refetchJobs();
  }, [refetchJobs]);

  // Memoize context value to prevent unnecessary re-renders
  const value: EmployerJobPostContextType = useMemo(
    () => ({
      jobs,
      isLoading: isLoadingState,
      error,
      createJob,
      updateJob,
      deleteJob,
      refreshJobs,
    }),
    [
      jobs,
      isLoadingState,
      error,
      createJob,
      updateJob,
      deleteJob,
      refreshJobs,
    ]
  );

  return (
    <EmployerJobPostContext.Provider value={value}>
      {children}
    </EmployerJobPostContext.Provider>
  );
}

