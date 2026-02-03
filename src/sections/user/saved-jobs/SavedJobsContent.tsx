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
import { useCandidateJobContext } from "@/hooks/use-candidate-job-context";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/date";
import { logger } from "@/lib/logger";

export default function SavedJobsContent() {
  const { savedJobs, isLoading, unsaveJob } = useCandidateJobContext();

  const handleUnsave = async (jobId: string, jobTitle: string) => {
    try {
      await unsaveJob(jobId);
      toast.success("Job removed from saved jobs");
    } catch (error) {
      toast.error("Failed to remove job from saved jobs");
      // PRODUCTION: Use logger for production-safe error logging
      logger.error("Error unsaving job:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Safely handle undefined/null savedJobs
  const safeSavedJobs = savedJobs || [];

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Saved Jobs</h1>
            <p className="text-muted-foreground">
              Jobs you've saved for later. Apply when you're ready.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/jobs">
              <SafeIcon name="Search" size={18} className="mr-2" />
              Browse More Jobs
            </Link>
          </Button>
        </div>

        {/* Saved Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs ({safeSavedJobs.length})</CardTitle>
            <CardDescription>Your saved job listings</CardDescription>
          </CardHeader>
          <CardContent>
            {safeSavedJobs && Array.isArray(safeSavedJobs) && safeSavedJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {safeSavedJobs
                  .filter((job) => job && job.id && job.company && job.company.name)
                  .map((job) => (
                  <div
                    key={job.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {job.company?.logoUrl && (
                            <img
                              src={job.company.logoUrl}
                              alt={`${job.company?.name || 'Company'} company logo`}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                <Link to={`/jobs/${job.id}`} className="hover:underline">
                                  {job.title || 'Untitled Job'}
                                </Link>
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-shrink-0 h-8 w-8 p-0"
                                onClick={() => handleUnsave(job.id, job.title || 'Job')}
                                title="Remove from saved jobs"
                              >
                                <SafeIcon name="BookmarkX" size={18} className="text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {job.company?.name || 'Unknown Company'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <SafeIcon name="MapPin" size={14} />
                                {job.location || 'Location not specified'}
                              </span>
                              <span className="flex items-center gap-1">
                                <SafeIcon name="Briefcase" size={14} />
                                {job.jobType || 'Full-Time'}
                              </span>
                              {job.experienceLevel && (
                                <span className="flex items-center gap-1">
                                  <SafeIcon name="User" size={14} />
                                  {job.experienceLevel}
                                </span>
                              )}
                              {job.industry && (
                                <Badge variant="secondary" className="text-xs">
                                  {job.industry}
                                </Badge>
                              )}
                            </div>
                            {job.postedDate && (
                              <p className="text-xs text-muted-foreground">
                                Posted {formatRelativeDate(job.postedDate)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-4 flex-shrink-0">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" asChild>
                          <Link to={`/jobs/${job.id}`}>
                            <SafeIcon name="Eye" size={14} className="mr-1.5" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 sm:flex-initial" asChild>
                          <Link to={`/jobs/${job.id}/apply`}>
                            <SafeIcon name="Send" size={14} className="mr-1.5" />
                            Apply Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <SafeIcon
                    name="Bookmark"
                    size={40}
                    className="text-muted-foreground"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No saved jobs yet
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save jobs you're interested in to apply later. Click the bookmark icon on any job listing to save it here.
                </p>
                <Button asChild>
                  <Link to="/jobs">
                    <SafeIcon name="Search" size={16} className="mr-2" />
                    Browse Jobs
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
