import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import { useCandidateJobContext } from "@/hooks/use-candidate-job-context";
import { toast } from "sonner";

interface JobCardProps {
  variant?: "compact" | "detailed";
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary?: string;
    postedDate: string;
    experienceLevel?: string;
    description?: string;
    tags?: string[];
  };
}

export default function JobCard({ variant = "compact", job }: JobCardProps) {
  const { isJobSaved, saveJob, unsaveJob } = useCandidateJobContext();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Load bookmark state from hook
  useEffect(() => {
    setIsBookmarked(isJobSaved(job.id));
  }, [job.id, isJobSaved]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);
    try {
      if (isBookmarked) {
        await unsaveJob(job.id);
        setIsBookmarked(false);
        toast.success("Job removed from saved jobs");
      } else {
        await saveJob(job.id);
        setIsBookmarked(true);
        toast.success("Job saved");
      }
    } catch (error) {
      toast.error("Failed to update saved jobs");
    } finally {
      setIsToggling(false);
    }
  };

  if (variant === "detailed") {
    return (
      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <SafeIcon name="Building2" size={16} aria-hidden="true" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <SafeIcon name="MapPin" size={16} aria-hidden="true" />
                  {job.location}
                </span>
              </CardDescription>
            </div>
            <Button
              variant={isBookmarked ? "default" : "ghost"}
              size="icon"
              aria-label={
                isBookmarked ? "Remove bookmark" : "Bookmark this job"
              }
              onClick={handleBookmark}
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
        </CardHeader>
        <CardContent>
          {job.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {job.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{job.type}</Badge>
            {job.experienceLevel && (
              <Badge variant="outline">{job.experienceLevel}</Badge>
            )}
            {job.salary && <Badge variant="outline">{job.salary}</Badge>}
            {job.tags?.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SafeIcon name="Clock" size={14} />
            <span>Posted {job.postedDate}</span>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button className="flex-1" asChild>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/jobs/${job.id}/apply`}>Quick Apply</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">
              <Link
                to={`/jobs/${job.id}`}
                className="hover:text-primary transition-colors"
              >
                {job.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-sm">{job.company}</CardDescription>
          </div>
          <Button
            variant={isBookmarked ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 transition-all"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this job"}
            onClick={handleBookmark}
          >
            <SafeIcon
              name="Bookmark"
              size={16}
              aria-hidden="true"
              className={isBookmarked ? "fill-current" : ""}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <SafeIcon name="MapPin" size={14} />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <SafeIcon name="Briefcase" size={14} />
            {job.type}
          </span>
          {job.experienceLevel && (
            <span className="flex items-center gap-1">
              <SafeIcon name="TrendingUp" size={14} />
              {job.experienceLevel}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1">
              <SafeIcon name="DollarSign" size={14} />
              {job.salary}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <SafeIcon name="Clock" size={12} />
          <span>{job.postedDate}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button size="sm" className="w-full" asChild>
          <Link to={`/jobs/${job.id}/apply`}>Apply Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
