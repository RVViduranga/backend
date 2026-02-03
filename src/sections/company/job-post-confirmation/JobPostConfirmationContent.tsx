import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import JobPostConfirmationBreadcrumb from "./JobPostConfirmationBreadcrumb";
import { useJobPostReview } from "@/hooks/use-job-post-review";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/date";

interface JobPostConfirmationContentProps {
  jobId?: string;
}

export default function JobPostConfirmationContent({
  jobId,
}: JobPostConfirmationContentProps) {
  const location = useLocation();
  const jobIdFromState = location.state?.jobId || jobId;
  const { jobData, isLoading } = useJobPostReview();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Use job data from hook, or fallback to basic display
  const displayJob = jobData || {
    title: "Job Posting",
    company: { id: "", name: "Your Company", logoUrl: "" },
    location: "Location",
    jobType: "Full-Time",
    salaryRange: "To be discussed",
    postedDate: new Date().toISOString(),
    description: "Job posted successfully.",
    requiredSkills: [] as string[],
    applicationsReceived: 0,
    viewsCount: 0,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <JobPostConfirmationBreadcrumb />

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6 p-4 bg-background rounded-lg border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted-foreground/20 text-muted-foreground flex items-center justify-center font-semibold">
                1
              </div>
              <span className="font-medium text-sm text-muted-foreground">
                Job Details
              </span>
            </div>
            <SafeIcon
              name="ChevronRight"
              size={16}
              className="text-muted-foreground"
            />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-muted-foreground/20 text-muted-foreground flex items-center justify-center font-semibold">
                2
              </div>
              <span className="font-medium text-sm text-muted-foreground">
                Review
              </span>
            </div>
            <SafeIcon
              name="ChevronRight"
              size={16}
              className="text-muted-foreground"
            />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                3
              </div>
              <span className="font-medium text-sm">Publish</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Step 3 of 3</span>
        </div>

        {/* Success Icon and Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <SafeIcon name="CheckCircle2" size={40} color="#22c55e" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Job Posted Successfully!</h1>
          <p className="text-lg text-muted-foreground">
            Your job vacancy is now live and visible to job seekers on the
            platform.
          </p>
        </div>

        {/* Job Details Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {displayJob.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {displayJob.company.name}
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Location</p>
                <p className="font-semibold flex items-center gap-2">
                  <SafeIcon name="MapPin" size={16} />
                  {displayJob.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Job Type</p>
                <p className="font-semibold flex items-center gap-2">
                  <SafeIcon name="Briefcase" size={16} />
                  {displayJob.jobType}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Salary Range
                </p>
                <p className="font-semibold flex items-center gap-2">
                  <SafeIcon name="DollarSign" size={16} />
                  {typeof displayJob.salaryRange === "object" && displayJob.salaryRange !== null
                    ? `Rs. ${displayJob.salaryRange.min.toLocaleString()} - ${displayJob.salaryRange.max.toLocaleString()}`
                    : displayJob.salaryRange || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Posted</p>
                <p className="font-semibold flex items-center gap-2">
                  <SafeIcon name="Clock" size={16} />
                  {displayJob.postedDate
                    ? formatDate(displayJob.postedDate)
                    : "Just now"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground">{displayJob.description}</p>
            </div>

            {/* Tags */}
            {"requiredSkills" in displayJob &&
              displayJob.requiredSkills &&
              displayJob.requiredSkills.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {displayJob.requiredSkills.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {"applicationsReceived" in displayJob
                    ? displayJob.applicationsReceived
                    : displayJob.applicationsCount || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Applications Received
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {"viewsCount" in displayJob
                    ? displayJob.viewsCount
                    : displayJob.views || 0}
                </p>
                <p className="text-sm text-muted-foreground">Job Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SafeIcon name="Lightbulb" size={20} />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <SafeIcon
                  name="CheckCircle"
                  size={20}
                  className="text-green-600 flex-shrink-0 mt-0.5"
                />
                <span className="text-sm">
                  Your job posting is now visible to all job seekers on the
                  platform
                </span>
              </li>
              <li className="flex gap-3">
                <SafeIcon
                  name="CheckCircle"
                  size={20}
                  className="text-green-600 flex-shrink-0 mt-0.5"
                />
                <span className="text-sm">
                  You'll receive notifications when candidates apply for this
                  position
                </span>
              </li>
              <li className="flex gap-3">
                <SafeIcon
                  name="CheckCircle"
                  size={20}
                  className="text-green-600 flex-shrink-0 mt-0.5"
                />
                <span className="text-sm">
                  You can edit or archive the job posting anytime from your
                  dashboard
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1" asChild>
            <Link
              to="/manage-jobs"
              className="flex items-center justify-center gap-2"
            >
              <SafeIcon name="Eye" size={20} />
              View Live Job Post
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <Link
              to="/company-dashboard"
              className="flex items-center justify-center gap-2"
            >
              <SafeIcon name="LayoutDashboard" size={20} />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Want to post another job?
          </p>
          <Button variant="secondary" asChild>
            <Link
              to="/job-post"
              className="flex items-center justify-center gap-2"
            >
              <SafeIcon name="Plus" size={18} />
              Post Another Job
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
