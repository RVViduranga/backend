import { useMemo } from "react";
import JobCard from "@/components/common/job-card";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { useJobSearchQuery } from "@/hooks/queries/use-job-search-query";
import { Loader2 } from "lucide-react";
import type { JobSummaryModel } from "@/models/jobPosts";
import { DEFAULT_JOB_TYPE } from "@/constants/job-forms";

export default function RelatedJobs() {
  const { id } = useParams<{ id: string }>();

  // Fetch all jobs to find related ones
  const { searchResults, isLoading, isSearching } = useJobSearchQuery({
    params: {
      sortBy: "recent",
      limit: 100, // Get enough jobs to filter from
    },
  });

  // Filter and limit related jobs (exclude current job, show max 3)
  const relatedJobs = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return [];
    return searchResults
      .filter((job) => job.id !== id)
      .slice(0, 3);
  }, [searchResults, id]);

  if (isLoading || isSearching) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Similar Jobs</h2>
          <p className="text-muted-foreground">
            You might also be interested in these positions
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (relatedJobs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Similar Jobs</h2>
          <p className="text-muted-foreground">
            You might also be interested in these positions
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
          <SafeIcon
            name="Briefcase"
            size={48}
            className="text-muted-foreground mb-4"
            aria-hidden="true"
          />
          <p className="text-muted-foreground text-center mb-4">
            No similar jobs found at the moment
          </p>
          <Button variant="outline" asChild>
            <Link to="/jobs">
              <SafeIcon name="Search" size={16} className="mr-2" aria-hidden="true" />
              Browse All Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Similar Jobs</h2>
        <p className="text-muted-foreground">
          You might also be interested in these positions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedJobs
          .filter((job) => job && job.id && job.company && job.company.name)
          .map((job) => (
            <JobCard 
              key={job.id} 
              job={{
                id: job.id,
                title: job.title || 'Untitled Job',
                company: job.company?.name || 'Unknown Company',
                location: job.location || 'Location not specified',
                type: job.jobType || DEFAULT_JOB_TYPE,
                postedDate: job.postedDate,
                experienceLevel: job.experienceLevel,
              }} 
              variant="compact" 
            />
          ))}
      </div>
    </div>
  );
}
