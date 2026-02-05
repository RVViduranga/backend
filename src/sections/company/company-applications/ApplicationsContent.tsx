import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafeIcon from "@/components/common/safe-icon";
import { useCompany } from "@/hooks/use-company-context";
import { formatRelativeDate } from "@/utils/date";
import type { ApplicationModel, ApplicationStatus } from "@/models/applications";
import { Loader2 } from "lucide-react";

export default function ApplicationsContent() {
  const { applications, jobs, isLoading } = useCompany();
  const [selectedTab, setSelectedTab] = useState<"all" | ApplicationStatus>(
    "all"
  );
  const [selectedJob, setSelectedJob] = useState<string>("all");

  const filteredApplications = applications.filter((app) => {
    const statusMatch = selectedTab === "all" || app.status === selectedTab;
    const jobMatch = selectedJob === "all" || (app.job || (app as any).jobPost || (app as any).jobId) === selectedJob; // ✅ Backend uses "job"
    return statusMatch && jobMatch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "Pending").length,
    reviewing: applications.filter((a) => a.status === "Reviewed").length,
    shortlisted: applications.filter((a) => a.status === "Reviewed").length, // Maps to Reviewed
    interview: applications.filter((a) => a.status === "Reviewed").length, // Maps to Reviewed
    accepted: applications.filter((a) => a.status === "Accepted").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case "Accepted":
        return "CheckCircle";
      case "Reviewed":
        return "Clock";
      case "Pending":
        return "Circle";
      case "Rejected":
        return "XCircle";
      default:
        return "Circle";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Applications</h1>
          <p className="text-muted-foreground">
            Review and manage candidate applications for your job postings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.reviewing}</div>
              <p className="text-xs text-muted-foreground">Reviewing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.shortlisted}</div>
              <p className="text-xs text-muted-foreground">Shortlisted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.interview}</div>
              <p className="text-xs text-muted-foreground">Interview</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.accepted}
              </div>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Filter by Job
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedJob === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedJob("all")}
                >
                  All Jobs
                </Button>
                {jobs.map((job) => (
                  <Button
                    key={job.id}
                    variant={selectedJob === job.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedJob(job.id)}
                  >
                    {job.title}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              Review and manage candidate applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedTab}
              onValueChange={(value) =>
                setSelectedTab(value as typeof selectedTab)
              }
            >
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              <TabsContent value={selectedTab} className="mt-4">
                {filteredApplications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {app.candidateName}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {app.candidateEmail}
                              </p>
                              <p className="text-sm font-medium text-primary mt-1">
                                {app.jobTitle}
                              </p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              <SafeIcon
                                name={getStatusIcon(app.status)}
                                size={14}
                                className="mr-1"
                              />
                              {app.status.charAt(0).toUpperCase() +
                                app.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <SafeIcon name="MapPin" size={14} />
                              {app.candidateLocation}
                            </span>
                            <span className="flex items-center gap-1">
                              <SafeIcon name="Clock" size={14} />
                              Applied {formatRelativeDate(app.appliedAt || (app as any).date || (app as any).appliedDate)} {/* ✅ Backend uses appliedAt */}
                            </span>
                            {app.experienceLevel && (
                              <span className="flex items-center gap-1">
                                <SafeIcon name="Briefcase" size={14} />
                                {app.experienceLevel}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/applications/${app.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <SafeIcon
                        name="FileText"
                        size={40}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No applications found
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No applications match your current filters. Try adjusting
                      your filters or check back later.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
