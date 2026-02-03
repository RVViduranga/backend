import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import JobPostReviewBreadcrumb from "./JobPostReviewBreadcrumb";
import { useJobPostReview } from "@/hooks/use-job-post-review";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/utils/date";

export default function JobPostReviewContent() {
  const navigate = useNavigate();
  const {
    jobData,
    isLoading,
    isPublishing,
    error,
    publishJob,
  } = useJobPostReview();

  const handleEdit = () => {
    navigate("/job-post");
  };

  const handleCancel = () => {
    navigate("/company-dashboard");
  };

  const handlePublish = async () => {
    const result = await publishJob();
    if (result.success) {
      toast.success("Job posted successfully!");
      navigate("/job-post-confirmation", { state: { jobId: result.jobId } });
    } else {
      toast.error(result.error || "Failed to publish job. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px-80px)] flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error or no data state
  if (error || !jobData) {
    return (
      <div className="min-h-[calc(100vh-64px-80px)] flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <SafeIcon
              name="AlertCircle"
              size={40}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {error || "No Job Data Found"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error
              ? "Failed to load job details. Please try again."
              : "Please go back and fill in the job posting form first."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/company-dashboard")}>
              Back to Dashboard
            </Button>
            <Button onClick={() => navigate("/job-post")}>
              Go to Job Post Form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px-80px)] py-8">
      <div className="container max-w-4xl px-4">
        <JobPostReviewBreadcrumb />

        {/* Progress Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-primary/5 via-primary/5 to-background border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/30 text-muted-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <span className="font-medium text-sm text-muted-foreground">
                    Job Details
                  </span>
                </div>
                <SafeIcon
                  name="ChevronRight"
                  size={18}
                  className="text-muted-foreground"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                  <span className="font-semibold text-sm">Review</span>
                </div>
                <SafeIcon
                  name="ChevronRight"
                  size={18}
                  className="text-muted-foreground"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/30 text-muted-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <span className="font-medium text-sm text-muted-foreground">
                    Publish
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs font-medium">
                Step 2 of 3
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <SafeIcon name="CheckCircle2" size={24} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Review Your Job Posting
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Please review all details below before publishing. You can edit any
            information if needed.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Job Header Card */}
          <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader className="pb-4 border-b bg-gradient-to-r from-background to-muted/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-3">
                    {jobData.title}
                  </CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    <SafeIcon name="Building2" size={18} className="text-primary" />
                    <span className="font-medium">{jobData.company.name}</span>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-base px-4 py-2 font-semibold">
                  {jobData.jobType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold flex items-center gap-2">
                    <SafeIcon name="MapPin" size={16} />
                    {jobData.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Experience Level
                  </p>
                  <p className="font-semibold">{jobData.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Salary Range
                  </p>
                  <p className="font-semibold">
                    {typeof jobData.salaryRange === "object" && jobData.salaryRange !== null
                      ? `Rs. ${jobData.salaryRange.min.toLocaleString()} - ${jobData.salaryRange.max.toLocaleString()}`
                      : jobData.salaryRange || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Application Deadline
                  </p>
                  <p className="font-semibold">{formatDate(jobData.closingDate || (jobData as any).applicationDeadline || "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <SafeIcon name="FileText" size={18} className="text-primary" />
                </div>
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">
                {jobData.description}
              </p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <SafeIcon name="ListChecks" size={18} className="text-green-600" />
                </div>
                Key Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {jobData.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-foreground">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Qualifications */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <SafeIcon name="Award" size={18} className="text-purple-600" />
                </div>
                Required Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {jobData.qualifications.map((qualification, index) => (
                  <li key={index} className="flex gap-3">
                    <SafeIcon
                      name="CheckCircle2"
                      size={20}
                      className="text-primary flex-shrink-0 mt-0.5"
                    />
                    <span className="text-foreground">{qualification}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-background to-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <SafeIcon name="Settings" size={18} className="text-blue-600" />
                </div>
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Application Method</span>
                  <Badge>Through Platform</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Candidate Screening</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Auto-Response</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              size="lg"
              className="flex-1 shadow-lg hover:shadow-xl transition-shadow"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <SafeIcon name="Send" size={18} className="mr-2" />
                  Publish Job
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 shadow-sm hover:shadow-md transition-shadow"
              onClick={handleEdit}
            >
              <SafeIcon name="Edit2" size={18} className="mr-2" />
              Edit Details
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="flex-1"
              onClick={handleCancel}
            >
              <SafeIcon name="X" size={18} className="mr-2" />
              Cancel
            </Button>
          </div>

          {/* Info Box */}
          <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-200/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <SafeIcon
                    name="Info"
                    size={20}
                    className="text-blue-600"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1.5">
                    Ready to publish?
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Once published, your job posting will be visible to all job
                    seekers on the platform. You can edit or archive it anytime from
                    your Manage Jobs page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
