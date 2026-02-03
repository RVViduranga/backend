import { Link, useParams } from "react-router-dom";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";

export default function JobApplicationBreadcrumb() {
  const { id } = useParams<{ id: string }>();
  const { job } = useJobQuery({ jobId: id });

  // Truncate long job titles for breadcrumb
  const displayTitle = job
    ? job.title.length > 40
      ? `${job.title.substring(0, 40)}...`
      : job.title
    : "Job";

  return (
    <nav
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap"
      aria-label="Breadcrumb"
    >
      <Link
        to="/jobs"
        className="hover:text-primary transition-colors flex items-center gap-1"
      >
        <SafeIcon name="Briefcase" size={16} aria-hidden="true" />
        Jobs
      </Link>
      <SafeIcon
        name="ChevronRight"
        size={16}
        className="text-muted-foreground/50 flex-shrink-0"
        aria-hidden="true"
      />
      <Link
        to={`/jobs/${id}`}
        className="hover:text-primary transition-colors truncate"
        title={job?.title}
      >
        {displayTitle}
      </Link>
      <SafeIcon
        name="ChevronRight"
        size={16}
        className="text-muted-foreground/50 flex-shrink-0"
        aria-hidden="true"
      />
      <span className="text-foreground font-medium">Apply</span>
    </nav>
  );
}




