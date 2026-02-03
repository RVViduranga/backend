import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { logger } from "@/lib/logger";

export default function JobDetailsActions() {
  const { id } = useParams<{ id: string }>();
  const { job } = useJobQuery({ jobId: id });
  const [linkCopied, setLinkCopied] = useState(false);

  const jobUrl = `${window.location.origin}/jobs/${id}`;
  const jobTitle = job?.title || "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy link:", err);
    }
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareTwitter = () => {
    const text = `Check out this job: ${jobTitle}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleShareEmail = () => {
    const subject = `Job Opportunity: ${jobTitle}`;
    const body = `I found this job opportunity that might interest you:\n\n${jobTitle}\n${jobUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Button size="lg" className="w-full" asChild>
          <Link to={`/jobs/${id}/apply`}>
            <SafeIcon name="Send" size={18} className="mr-2" aria-hidden="true" />
            Apply Now
          </Link>
        </Button>
        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link to="/jobs">
            <SafeIcon name="ArrowLeft" size={18} className="mr-2" aria-hidden="true" />
            Back to Search
          </Link>
        </Button>
        <div className="pt-4 border-t space-y-2">
          <p className="text-xs text-muted-foreground text-center">Share this job</p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              aria-label="Share on LinkedIn"
              onClick={handleShareLinkedIn}
            >
              <SafeIcon name="Linkedin" size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              aria-label="Share on Twitter"
              onClick={handleShareTwitter}
            >
              <SafeIcon name="Twitter" size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              aria-label="Share via Email"
              onClick={handleShareEmail}
            >
              <SafeIcon name="Mail" size={16} aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              aria-label="Copy Link"
              onClick={handleCopyLink}
            >
              <SafeIcon
                name={linkCopied ? "Check" : "Copy"}
                size={16}
                aria-hidden="true"
                className={linkCopied ? "text-green-600" : ""}
              />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
