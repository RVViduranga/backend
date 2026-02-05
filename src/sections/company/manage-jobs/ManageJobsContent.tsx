import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SafeIcon from "@/components/common/safe-icon";
import JobListingTable from "./JobListingTable";
import { useCompany } from "@/hooks/use-company-context";
import { Loader2 } from "lucide-react";
import type { JobSummaryModel, JobStatus } from "@/models/jobPosts";

export default function ManageJobsContent() {
  const { jobs, isLoading, refreshJobs } = useCompany();
  const [selectedTab, setSelectedTab] = useState<
    "all" | "active" | "inactive" | "closed"
  >("all");

  // Load jobs on mount
  useEffect(() => {
    if (jobs.length === 0 && !isLoading) {
      refreshJobs();
    }
  }, []);

  const filteredJobs = jobs.filter((job: JobSummaryModel) => {
    if (selectedTab === "all") return true;
    return job.status?.toLowerCase() === selectedTab.toLowerCase();
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter((j: JobSummaryModel) => j.status === "Active").length,
    inactive: jobs.filter((j: JobSummaryModel) => j.status === "Inactive")
      .length,
    closed: jobs.filter((j: JobSummaryModel) => j.status === "Closed").length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Jobs</h1>
            <p className="text-muted-foreground">
              View, edit, and manage all your job postings
            </p>
          </div>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/job-post">
              <SafeIcon name="Plus" size={20} className="mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SafeIcon
                    name="Briefcase"
                    size={24}
                    className="text-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <SafeIcon
                    name="CheckCircle"
                    size={24}
                    className="text-green-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.inactive}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <SafeIcon
                    name="AlertCircle"
                    size={24}
                    className="text-yellow-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {stats.closed}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <SafeIcon
                    name="XCircle"
                    size={24}
                    className="text-gray-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Table */}
        <div className="bg-card border rounded-lg">
          <Tabs
            value={selectedTab}
            onValueChange={(value: string) =>
              setSelectedTab(value as "all" | "active" | "inactive" | "closed")
            }
            className="w-full"
          >
            <div className="border-b px-6">
              <TabsList className="bg-transparent border-0 h-auto p-0">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  All Jobs ({stats.total})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  Active ({stats.active})
                </TabsTrigger>
                <TabsTrigger
                  value="inactive"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  Inactive ({stats.inactive})
                </TabsTrigger>
                <TabsTrigger
                  value="closed"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
                >
                  Closed ({stats.closed})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={selectedTab} className="m-0">
              {filteredJobs.length > 0 ? (
                <JobListingTable jobs={filteredJobs} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <SafeIcon
                      name="Inbox"
                      size={40}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {selectedTab === "all"
                      ? "You haven't posted any jobs yet. Start by creating your first job posting."
                      : `No ${selectedTab} jobs at the moment.`}
                  </p>
                  <Button asChild>
                    <Link to="/job-post">
                      <SafeIcon name="Plus" size={16} className="mr-2" />
                      Post New Job
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
