/**
 * Company Context
 * Provides company profile, jobs, and applications data globally
 *
 * Architecture: Context → TanStack Query → Service → API/Mock
 * Uses TanStack Query for data fetching with automatic caching and refetching
 */
import React, {
  createContext,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth-context";
import { useCompanyProfileQuery } from "@/hooks/queries/use-company-profile-query";
import { useCompanyJobsQuery } from "@/hooks/queries/use-company-jobs-query";
import { useCompanyApplicationsQuery } from "@/hooks/queries/use-company-applications-query";
import companyService from "@/services/company";
import { logger } from "@/lib/logger";
import { ERROR_MESSAGES } from "@/constants";
import type { CompanyDetailModel, CompanySummaryModel } from "@/models/company";
import type { JobSummaryModel } from "@/models/job";
import type { ApplicationModel } from "@/models/application";

interface CompanyContextType {
  profile: CompanyDetailModel | null;
  summary: CompanySummaryModel | null;
  jobs: JobSummaryModel[];
  applications: ApplicationModel[];
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<CompanyDetailModel>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshJobs: () => Promise<void>;
  refreshApplications: () => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Use TanStack Query hooks for fetching data
  const {
    profile,
    summary,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useCompanyProfileQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  const {
    jobs,
    isLoading: isLoadingJobs,
    isError: isJobsError,
    error: jobsError,
    refetch: refetchJobs,
  } = useCompanyJobsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  const {
    applications,
    isLoading: isLoadingApplications,
    isError: isApplicationsError,
    error: applicationsError,
    refetch: refetchApplications,
  } = useCompanyApplicationsQuery({
    isAuthenticated,
    userType: user?.userType,
  });

  // Combined loading state
  const isLoading = isLoadingProfile || isLoadingJobs || isLoadingApplications;

  // Convert query errors to string for backward compatibility
  const error = useMemo(() => {
    if (isProfileError && profileError) {
      return profileError instanceof Error
        ? profileError.message
        : ERROR_MESSAGES.PROFILE_LOAD_FAILED;
    }
    if (isJobsError && jobsError) {
      return jobsError instanceof Error
        ? jobsError.message
        : ERROR_MESSAGES.GENERIC;
    }
    if (isApplicationsError && applicationsError) {
      return applicationsError instanceof Error
        ? applicationsError.message
        : ERROR_MESSAGES.GENERIC;
    }
    return null;
  }, [
    isProfileError,
    profileError,
    isJobsError,
    jobsError,
    isApplicationsError,
    applicationsError,
  ]);

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<CompanyDetailModel>) =>
      companyService.updateProfile(updates),
    onSuccess: (updated) => {
      // Invalidate and refetch company profile query after successful update
      queryClient.invalidateQueries({ queryKey: ['company', 'profile'] });
      logger.info('Company profile updated successfully');
    },
    onError: (err) => {
      logger.error('Error updating company profile:', err);
    },
  });

  const updateProfile = useCallback(
    async (updates: Partial<CompanyDetailModel>) => {
      try {
        await updateProfileMutation.mutateAsync(updates);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : ERROR_MESSAGES.PROFILE_UPDATE_FAILED;
        logger.error('Error updating company profile:', err);
        throw new Error(errorMessage);
      }
    },
    [updateProfileMutation]
  );

  const refreshProfile = useCallback(async () => {
    await refetchProfile();
  }, [refetchProfile]);

  const refreshJobs = useCallback(async () => {
    await refetchJobs();
  }, [refetchJobs]);

  const refreshApplications = useCallback(async () => {
    await refetchApplications();
  }, [refetchApplications]);

  // Memoize context value to prevent unnecessary re-renders
  const value: CompanyContextType = useMemo(
    () => ({
      profile,
      summary,
      jobs,
      applications,
      isLoading,
      error,
      updateProfile,
      refreshProfile,
      refreshJobs,
      refreshApplications,
    }),
    [
      profile,
      summary,
      jobs,
      applications,
      isLoading,
      error,
      updateProfile,
      refreshProfile,
      refreshJobs,
      refreshApplications,
    ]
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}


