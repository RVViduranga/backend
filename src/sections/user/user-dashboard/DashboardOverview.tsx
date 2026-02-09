import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SafeIcon from "@/components/common/safe-icon";
import ApplicationsCard from "./ApplicationsCard";
import SavedJobsCard from "./SavedJobsCard";
import ProfileStatusCard from "./ProfileStatusCard";
import { useAuth } from "@/hooks/use-auth-context";
import { useUser } from "@/hooks/use-user-context";
import { useCandidateJobContext } from "@/hooks/use-candidate-job-context";
import { useCandidateApplicationContext } from "@/hooks/use-candidate-application-context";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { calculateProfileCompletion } from "@/hooks/use-profile-completion";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUser();
  const { savedJobs, isLoading: savedJobsLoading } = useCandidateJobContext();
  const { applications, isLoading: applicationsLoading } = useCandidateApplicationContext();
  
  const jobsLoading = savedJobsLoading || applicationsLoading;

  const isLoading = profileLoading || jobsLoading;

  // Calculate dashboard stats from real data
  const dashboardStats = useMemo(() => {
    const totalApplications = applications.length;
    const activeApplications = applications.filter(
      (app) => !["rejected", "accepted"].includes(app.status)
    ).length;
    const savedJobsCount = savedJobs.length;

    // Calculate profile completion using shared hook
    const profileCompletion = calculateProfileCompletion(profile);

    return {
      totalApplications,
      activeApplications,
      savedJobs: savedJobsCount,
      profileCompletion,
    };
  }, [applications, savedJobs, profile]);

  // Get user's first name or fallback
  const userName = useMemo(() => {
    if (profile?.fullName) {
      return profile.fullName.split(" ")[0];
    }
    if (user?.name) {
      return user.name.split(" ")[0];
    }
    return "there";
  }, [profile, user]);

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {greeting}, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your job search today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.totalApplications}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardStats.activeApplications} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.savedJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to apply</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Interview Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {applications.filter((app) => app.status === "Reviewed").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Upcoming interviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {dashboardStats.profileCompletion}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Complete your profile
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Applications and Saved Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <ApplicationsCard />
          <SavedJobsCard />
        </div>

        {/* Right Column - Profile Status and Quick Actions */}
        <div className="space-y-6">
          <ProfileStatusCard
            profileCompletion={dashboardStats.profileCompletion}
          />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link to="/jobs">
                  <SafeIcon name="Search" size={18} className="mr-2" />
                  Find Jobs
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link to="/user-profile-management">
                  <SafeIcon name="User" size={18} className="mr-2" />
                  Manage Profile
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link to="/cv-management">
                  <SafeIcon name="FileText" size={18} className="mr-2" />
                  Manage CV
                </Link>
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
                asChild
              >
                <Link to="/user-settings">
                  <SafeIcon name="Settings" size={18} className="mr-2" />
                  Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommendations</CardTitle>
              <CardDescription>Based on your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Complete Your Profile
                </p>
                <p className="text-xs text-muted-foreground">
                  Profiles with photos get 40% more views
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Upload Your CV</p>
                <p className="text-xs text-muted-foreground">
                  Make it easier for employers to review your qualifications
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Set Job Alerts</p>
                <p className="text-xs text-muted-foreground">
                  Get notified about jobs matching your preferences
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
