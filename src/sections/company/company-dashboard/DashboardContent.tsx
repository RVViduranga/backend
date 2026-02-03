import { Loader2 } from "lucide-react";
import { useCompany } from "@/hooks/use-company-context";
import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import QuickActions from "./QuickActions";
import RecentApplicationsCard from "./RecentApplicationsCard";
import RecentJobsList from "./RecentJobsList";

export default function DashboardContent() {
  const { profile, summary, isLoading } = useCompany();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Company Profile Found</h2>
          <p className="text-muted-foreground mb-4">
            Please complete your company profile to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 space-y-8 p-6 lg:p-8">
        <DashboardHero company={profile} summary={summary} />

        <DashboardStats summary={summary} />

        <QuickActions />

        {/* Recent Applications */}
        <RecentApplicationsCard />

        {/* Recent Jobs */}
        <RecentJobsList />
      </div>
    </div>
  );
}
