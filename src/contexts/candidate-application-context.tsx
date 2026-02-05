/**
 * Candidate Application Context
 * Manages jobs applied by the candidate and apply-for-job logic
 *
 * Architecture: Context → TanStack Query → Service → API/Mock
 * Uses TanStack Query for data fetching with automatic caching and refetching
 * Used ONLY in candidate pages
 */
import React, {
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { useUserApplicationsQuery } from "@/hooks/queries/use-user-applications-query";
import { useApplyJobMutation } from "@/hooks/mutations/use-apply-job-mutation";
import type { UserApplicationModel } from "@/models/applications";
import type { JobApplicationData, JobApplicationResponse } from "@/services/job";

interface CandidateApplicationContextType {
  applications: UserApplicationModel[];
  isLoading: boolean;
  error: string | null;
  applyForJob: (data: JobApplicationData) => Promise<JobApplicationResponse>;
  refreshApplications: () => Promise<void>;
}

export const CandidateApplicationContext = createContext<
  CandidateApplicationContextType | undefined
>(undefined);

export function CandidateApplicationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Use TanStack Query hook for fetching user applications
  const {
    applications,
    isLoading,
    isError,
    error: queryError,
    refetch: refetchApplications,
  } = useUserApplicationsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Use mutation hook for applying to jobs
  const {
    applyForJob: applyForJobMutation,
    isPending: isMutationPending,
    error: mutationError,
  } = useApplyJobMutation();

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

  const applyForJob = useCallback(
    async (data: JobApplicationData): Promise<JobApplicationResponse> => {
      try {
        const response = await applyForJobMutation(data);
        // Query invalidation is handled automatically in the mutation hook
        return response;
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [applyForJobMutation]
  );

  const refreshApplications = useCallback(async () => {
    await refetchApplications();
  }, [refetchApplications]);

  // Memoize context value to prevent unnecessary re-renders
  const value: CandidateApplicationContextType = useMemo(
    () => ({
      applications,
      isLoading: isLoadingState,
      error,
      applyForJob,
      refreshApplications,
    }),
    [applications, isLoadingState, error, applyForJob, refreshApplications]
  );

  return (
    <CandidateApplicationContext.Provider value={value}>
      {children}
    </CandidateApplicationContext.Provider>
  );
}

