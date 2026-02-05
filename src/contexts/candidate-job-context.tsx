/**
 * Candidate Job Context
 * Manages public job listings, job search, and saved jobs for candidates
 *
 * Architecture: Context → TanStack Query → Service → API/Mock
 * Uses TanStack Query for data fetching with automatic caching and refetching
 * Used ONLY in public and candidate pages
 */
import React, {
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { useSavedJobsQuery } from "@/hooks/queries/use-saved-jobs-query";
import { useSaveJobMutation } from "@/hooks/mutations/use-save-job-mutation";
import type { JobSummaryModel } from "@/models/jobPosts";

interface CandidateJobContextType {
  savedJobs: JobSummaryModel[];
  isLoading: boolean;
  error: string | null;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  isJobSaved: (jobId: string) => boolean;
  refreshSavedJobs: () => Promise<void>;
}

export const CandidateJobContext = createContext<CandidateJobContextType | undefined>(
  undefined
);

export function CandidateJobProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Use TanStack Query hook for fetching saved jobs
  const {
    savedJobs,
    isLoading,
    isError,
    error: queryError,
    refetch: refetchSavedJobs,
  } = useSavedJobsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Use mutation hook for saving/unsaving jobs
  const {
    saveJob: saveJobMutation,
    unsaveJob: unsaveJobMutation,
    isPending: isMutationPending,
    error: mutationError,
  } = useSaveJobMutation();

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

  const saveJob = useCallback(
    async (jobId: string) => {
      try {
        await saveJobMutation(jobId);
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [saveJobMutation]
  );

  const unsaveJob = useCallback(
    async (jobId: string) => {
      try {
        await unsaveJobMutation(jobId);
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [unsaveJobMutation]
  );

  const isJobSaved = useCallback(
    (jobId: string): boolean => {
      return savedJobs.some((job) => job.id === jobId);
    },
    [savedJobs]
  );

  const refreshSavedJobs = useCallback(async () => {
    await refetchSavedJobs();
  }, [refetchSavedJobs]);

  // Memoize context value to prevent unnecessary re-renders
  const value: CandidateJobContextType = useMemo(
    () => ({
      savedJobs,
      isLoading: isLoadingState,
      error,
      saveJob,
      unsaveJob,
      isJobSaved,
      refreshSavedJobs,
    }),
    [
      savedJobs,
      isLoadingState,
      error,
      saveJob,
      unsaveJob,
      isJobSaved,
      refreshSavedJobs,
    ]
  );

  return (
    <CandidateJobContext.Provider value={value}>{children}</CandidateJobContext.Provider>
  );
}

