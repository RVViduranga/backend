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
import SafeIcon from "@/components/common/safe-icon";
import { useCompany } from "@/hooks/use-company-context";
import { formatRelativeDate } from "@/utils/date";
import { useMemo } from "react";

export default function RecentJobsList() {
  const { jobs } = useCompany();

  // Get the 4 most recent jobs
  const recentJobs = useMemo(() => jobs.slice(0, 4), [jobs]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      case "Pending Review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <SafeIcon name="Briefcase" size={24} className="text-primary" />
            Recent Job Postings
          </h2>
          <p className="text-muted-foreground">
            Your latest job listings and their performance
          </p>
        </div>
        <Button asChild className="shadow-sm hover:shadow-md transition-shadow">
          <Link to="/manage-jobs" className="flex items-center gap-2">
            View All Jobs
            <SafeIcon name="ArrowRight" size={16} />
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
          <CardTitle className="text-xl font-bold">Active & Recent Postings</CardTitle>
          <CardDescription className="mt-1.5">Manage and track your job listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">
                    Job Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Posted</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Applicants
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b hover:bg-muted/50 hover:shadow-sm transition-all duration-200"
                    >
                      <td className="py-3 px-4 font-medium">
                        <Link
                          to={`/jobs/${job.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {job.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <SafeIcon name="MapPin" size={14} />
                          {job.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{job.jobType}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatRelativeDate(job.postedDate)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <SafeIcon name="Users" size={14} />
                          <span className="font-semibold">
                            {job.applicationsCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status || "Unknown"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/job-post-review?id=${job.id}`}>
                              <SafeIcon name="Edit" size={16} />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <SafeIcon name="MoreHorizontal" size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <SafeIcon
                            name="Briefcase"
                            size={32}
                            className="text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          No job postings yet
                        </h3>
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                          Create your first job posting to start attracting
                          qualified candidates.
                        </p>
                        <Button asChild>
                          <Link to="/job-post">
                            <SafeIcon name="Plus" size={16} className="mr-2" />
                            Post Your First Job
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State Info */}
      <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <SafeIcon
                name="Lightbulb"
                size={20}
                className="text-blue-600"
              />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1.5">Pro Tip</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Jobs with detailed descriptions and requirements tend to attract
                more qualified candidates. Consider adding more details to your
                job postings to improve application quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
