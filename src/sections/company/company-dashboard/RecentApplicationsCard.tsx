import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { useCompany } from "@/hooks/use-company-context";
import { formatRelativeDate } from "@/utils/date";
import type { ApplicationStatus } from "@/models/applications";
import { useMemo } from "react";

export default function RecentApplicationsCard() {
  const { applications } = useCompany();

  // Get the 5 most recent applications
  const recentApplications = useMemo(
    () => applications.slice(0, 5),
    [applications]
  );

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
      case "accepted":
        return "bg-green-100 text-green-800";
      case "Reviewed":
      case "reviewing":
      case "interview":
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "Rejected":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
      case "accepted":
        return "CheckCircle";
      case "Reviewed":
      case "reviewing":
      case "interview":
      case "shortlisted":
        return "Clock";
      case "Pending":
      case "pending":
        return "Circle";
      case "Rejected":
      case "rejected":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  const pendingCount = recentApplications.filter(
    (app) => app.status === "Pending" || app.status === "Reviewed"
  ).length;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <SafeIcon name="Users" size={20} className="text-primary" />
              Recent Applications
            </CardTitle>
            <CardDescription className="mt-1.5">
              Latest candidate applications that need your attention
              {pendingCount > 0 && (
                <span className="ml-2 font-semibold text-primary">
                  ({pendingCount} pending review)
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/company-applications" className="flex items-center gap-1">
              View All
              <SafeIcon name="ArrowRight" size={14} />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentApplications.length > 0 ? (
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">
                        {app.candidateName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {app.candidateEmail}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        {app.jobTitle}
                      </p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      <SafeIcon
                        name={getStatusIcon(app.status)}
                        size={12}
                        className="mr-1"
                      />
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <SafeIcon name="MapPin" size={12} />
                      {app.candidateLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <SafeIcon name="Clock" size={12} />
                      Applied {formatRelativeDate(app.date || (app as any).appliedDate)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2" asChild>
                  <Link to={`/applications/${app.id}`}>
                    <SafeIcon name="ChevronRight" size={16} />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <SafeIcon
                name="Users"
                size={40}
                className="text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Applications will appear here once candidates start applying to
              your jobs. Post your first job to get started!
            </p>
            <Button asChild>
              <Link to="/job-post">
                <SafeIcon name="Plus" size={16} className="mr-2" />
                Post a Job
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


