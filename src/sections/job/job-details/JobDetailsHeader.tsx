import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import { useCandidateJobContext } from "@/hooks/use-candidate-job-context";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { toast } from "sonner";
import { formatRelativeDate } from "@/utils/date";
import { Loader2 } from "lucide-react";

export default function JobDetailsHeader() {
  const { id } = useParams<{ id: string }>();
  const { saveJob, unsaveJob, isJobSaved } = useCandidateJobContext();
  const { job, isLoading, isError, error } = useJobQuery({ jobId: id });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load bookmark state from JobContext
  useEffect(() => {
    if (id) {
      setIsBookmarked(isJobSaved(id));
    }
  }, [id, isJobSaved]);

  const handleBookmark = async () => {
    if (!id || isSaving) return;
    
    setIsSaving(true);
    try {
      if (isBookmarked) {
        await unsaveJob(id);
        setIsBookmarked(false);
        toast.success("Job removed from saved jobs");
      } else {
        await saveJob(id);
        setIsBookmarked(true);
        toast.success("Job saved successfully");
      }
    } catch (error) {
      toast.error("Failed to update saved jobs");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="text-center py-12">
        <SafeIcon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Job not found</h3>
        <p className="text-muted-foreground mb-4">{error?.message || "The job you're looking for doesn't exist."}</p>
        <Button asChild>
          <Link to="/jobs">Browse Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button - Mobile */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors lg:hidden mb-4"
      >
        <SafeIcon name="ArrowLeft" size={16} aria-hidden="true" />
        Back to Jobs
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
            <span className="flex items-center gap-2">
              <SafeIcon name="Building2" size={18} aria-hidden="true" />
              {job.company.name}
            </span>
            <span className="flex items-center gap-2">
              <SafeIcon name="MapPin" size={18} aria-hidden="true" />
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <SafeIcon name="Clock" size={18} aria-hidden="true" />
              Posted {formatRelativeDate(job.postedDate)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{job.jobType}</Badge>
            <Badge variant="secondary">{job.experienceLevel}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="icon"
            aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
            onClick={handleBookmark}
            disabled={isSaving}
            className="transition-all"
          >
            <SafeIcon
              name="Bookmark"
              size={20}
              aria-hidden="true"
              className={isBookmarked ? "fill-current" : ""}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
