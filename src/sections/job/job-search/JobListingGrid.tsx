import type { JobSummaryModel } from "@/models/jobPosts";
import JobCard from "@/components/common/job-card";

interface JobListingGridProps {
  jobs: JobSummaryModel[];
  viewMode: "grid" | "list";
}

export default function JobListingGrid({
  jobs,
  viewMode,
}: JobListingGridProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <JobCard
              variant="detailed"
              job={{
                id: job.id,
                title: job.title,
                company: job.company.name,
                location: job.location,
                type: job.jobType,
                postedDate: job.postedDate,
                experienceLevel: job.experienceLevel,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <JobCard
            variant="compact"
            job={{
              id: job.id,
              title: job.title,
              company: job.company.name,
              location: job.location,
              type: job.jobType,
              postedDate: job.postedDate,
              experienceLevel: job.experienceLevel,
            }}
          />
        </div>
      ))}
    </div>
  );
}
