/**
 * Employer Application Context
 * Manages applications received for employer job posts
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
import { useCompanyApplicationsQuery } from "@/hooks/queries/use-company-applications-query";
import { useApplicationStatusMutation } from "@/hooks/mutations/use-application-status-mutation";
import type { ApplicationModel } from "@/models/application";

interface EmployerApplicationContextType {
  applications: ApplicationModel[];
  isLoading: boolean;
  error: string | null;
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationModel["status"]
  ) => Promise<ApplicationModel>;
  refreshApplications: () => Promise<void>;
}

export const EmployerApplicationContext = createContext<
  EmployerApplicationContextType | undefined
>(undefined);

export function EmployerApplicationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  // Use TanStack Query hook for fetching company applications
  const {
    applications,
    isLoading,
    isError,
    error: queryError,
    refetch: refetchApplications,
  } = useCompanyApplicationsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Use mutation hook for updating application status
  const {
    updateApplicationStatus: updateApplicationStatusMutation,
    isPending: isMutationPending,
    error: mutationError,
  } = useApplicationStatusMutation();

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

  const updateApplicationStatus = useCallback(
    async (
      applicationId: string,
      status: ApplicationModel['status']
    ): Promise<ApplicationModel> => {
      try {
        const updated = await updateApplicationStatusMutation(
          applicationId,
          status
        );
        // Query invalidation is handled automatically in the mutation hook
        return updated;
      } catch (err) {
        // Error is already logged in mutation hook
        throw err;
      }
    },
    [updateApplicationStatusMutation]
  );

  const refreshApplications = useCallback(async () => {
    await refetchApplications();
  }, [refetchApplications]);

  // Memoize context value to prevent unnecessary re-renders
  const value: EmployerApplicationContextType = useMemo(
    () => ({
      applications,
      isLoading: isLoadingState,
      error,
      updateApplicationStatus,
      refreshApplications,
    }),
    [
      applications,
      isLoadingState,
      error,
      updateApplicationStatus,
      refreshApplications,
    ]
  );

  return (
    <EmployerApplicationContext.Provider value={value}>
      {children}
    </EmployerApplicationContext.Provider>
  );
}

