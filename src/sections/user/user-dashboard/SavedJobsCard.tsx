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
import { Loader2 } from "lucide-react";
import { formatRelativeDate } from "@/utils/date";

export default function SavedJobsCard() {
  const { savedJobs, isLoading } = useCandidateJobContext();

  // Show only first 3 jobs for dashboard preview
  // Safely handle undefined/null savedJobs
  const displayJobs = (savedJobs || []).slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Saved Jobs</CardTitle>
            <CardDescription>Jobs you're interested in</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/saved-jobs">View All ({(savedJobs || []).length})</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !displayJobs || displayJobs.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon
              name="Bookmark"
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Save jobs you're interested in to apply later.
            </p>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayJobs
              .filter((job) => job && job.id && job.company)
              .map((job) => (
                <div
                  key={job.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {job.title || "Untitled Job"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {job.company?.name || "Unknown Company"}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <SafeIcon
                          name="Bookmark"
                          size={16}
                          className="fill-current"
                        />
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {job.jobType || "Full-Time"}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <SafeIcon name="MapPin" size={12} />
                        {job.location || "Location not specified"}
                      </span>
                      {job.experienceLevel && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <SafeIcon name="User" size={12} />
                          {job.experienceLevel}
                        </span>
                      )}
                    </div>
                    {job.postedDate && (
                      <p className="text-xs text-muted-foreground">
                        Posted {formatRelativeDate(job.postedDate)}
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="ml-2" asChild>
                    <Link to={`/jobs/${job.id}`}>View</Link>
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
