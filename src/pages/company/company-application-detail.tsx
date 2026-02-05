import { useParams, Link, useNavigate } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SafeIcon from "@/components/common/safe-icon";
import { useCompany } from "@/hooks/use-company-context";
import { formatRelativeDate } from "@/utils/date";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ApplicationStatus } from "@/models/applications";
import companyService from "@/services/company";
import { toast } from "sonner";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_LABELS,
} from "@/constants/status";
import {
  getApplicationStatusColorClass,
  getApplicationStatusIcon,
} from "@/utils/status";
import { logger } from "@/lib/logger";

export default function CompanyApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, isLoading, refreshApplications } = useCompany();
  const [isUpdating, setIsUpdating] = useState(false);

  const application = useMemo(() => {
    return applications.find((app) => app.id === id);
  }, [applications, id]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application || !id) return;

    setIsUpdating(true);
    try {
      await companyService.updateApplicationStatus(id, newStatus);
      await refreshApplications();
      toast.success("Application status updated successfully");
    } catch (error) {
      toast.error("Failed to update application status");
      logger.error("Error updating application status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <BaseLayout
        title="Application Details - JobCenter"
        description="View application details"
      >
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </BaseLayout>
    );
  }

  if (!application) {
    return (
      <BaseLayout
        title="Application Not Found - JobCenter"
        description="Application not found"
      >
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-12 text-center">
                <SafeIcon
                  name="FileX"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h2 className="text-2xl font-bold mb-2">
                  Application Not Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  The application you're looking for doesn't exist or has been
                  removed.
                </p>
                <Button asChild>
                  <Link to="/company-applications">
                    <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
                    Back to Applications
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <CommonFooter variant="full" />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title={`${application.candidateName} - Application Details - JobCenter`}
      description={`View application details for ${application.candidateName}`}
    >
      <CommonHeader variant="default" />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link
                to="/company-dashboard"
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <SafeIcon name="ChevronRight" size={16} />
              <Link
                to="/company-applications"
                className="hover:text-foreground transition-colors"
              >
                Applications
              </Link>
              <SafeIcon name="ChevronRight" size={16} />
              <span className="text-foreground">
                {application.candidateName}
              </span>
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Candidate Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        {application.candidateName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {application.candidateEmail}
                      </CardDescription>
                    </div>
                    <Badge
                      className={getApplicationStatusColorClass(
                        application.status
                      )}
                    >
                      <SafeIcon
                        name={getApplicationStatusIcon(application.status)}
                        size={14}
                        className="mr-1"
                      />
                      {application.status.charAt(0).toUpperCase() +
                        application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <SafeIcon name="Mail" size={16} />
                        {application.candidateEmail}
                      </p>
                    </div>
                    {application.candidatePhone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <SafeIcon name="Phone" size={16} />
                          {application.candidatePhone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <SafeIcon name="MapPin" size={16} />
                        {application.candidateLocation}
                      </p>
                    </div>
                    {application.experienceLevel && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experience Level
                        </p>
                        <p className="font-medium flex items-center gap-2 mt-1">
                          <SafeIcon name="Briefcase" size={16} />
                          {application.experienceLevel}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Applied Date
                      </p>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <SafeIcon name="Clock" size={16} />
                        {formatRelativeDate(application.appliedAt || (application as any).date || (application as any).appliedDate || "")} {/* ✅ Backend uses appliedAt */}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="font-medium flex items-center gap-2 mt-1">
                        <SafeIcon name="Briefcase" size={16} />
                        {application.jobTitle || (application as any).job?.title || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.coverLetter ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {application.coverLetter}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <SafeIcon
                        name="FileText"
                        size={32}
                        className="mx-auto mb-2 text-muted-foreground/50"
                      />
                      <p className="text-sm text-muted-foreground">
                        No cover letter provided
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CV */}
              <Card>
                <CardHeader>
                  <CardTitle>Resume / CV</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.cvFilePath ? ( {/* ✅ Backend uses cvFilePath */}
                    <Button asChild>
                      <a
                        href={application.cvFilePath || (application as any).cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SafeIcon name="FileText" size={16} className="mr-2" />
                        View Resume
                      </a>
                    </Button>
                  ) : (
                    <div className="text-center py-8">
                      <SafeIcon
                        name="FileX"
                        size={32}
                        className="mx-auto mb-2 text-muted-foreground/50"
                      />
                      <p className="text-sm text-muted-foreground">
                        No resume/CV uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/jobs/${application.job || (application as any).jobPost || (application as any).jobId || ""}`}> {/* ✅ Backend uses job */}
                      <SafeIcon name="Eye" size={16} className="mr-2" />
                      View Job Posting
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/company-applications">
                      <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
                      Back to Applications
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Application Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge
                      className={getApplicationStatusColorClass(
                        application.status
                      )}
                    >
                      <SafeIcon
                        name={getApplicationStatusIcon(application.status)}
                        size={14}
                        className="mr-1"
                      />
                      {APPLICATION_STATUS_LABELS[application.status]}
                    </Badge>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Change Status
                      </label>
                      <Select
                        value={application.status}
                        onValueChange={(value) =>
                          handleStatusChange(value as ApplicationStatus)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">
                            {APPLICATION_STATUS_LABELS.pending}
                          </SelectItem>
                          <SelectItem value="reviewing">
                            {APPLICATION_STATUS_LABELS.reviewing}
                          </SelectItem>
                          <SelectItem value="shortlisted">
                            {APPLICATION_STATUS_LABELS.shortlisted}
                          </SelectItem>
                          <SelectItem value="interview">
                            {APPLICATION_STATUS_LABELS.interview}
                          </SelectItem>
                          <SelectItem value="accepted">
                            {APPLICATION_STATUS_LABELS.accepted}
                          </SelectItem>
                          <SelectItem value="rejected">
                            {APPLICATION_STATUS_LABELS.rejected}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Candidate */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Candidate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${application.candidateEmail}`}>
                      <SafeIcon name="Mail" size={16} className="mr-2" />
                      Send Email
                    </a>
                  </Button>
                  {application.candidatePhone && (
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={`tel:${application.candidatePhone.replace(
                          /\s/g,
                          ""
                        )}`}
                      >
                        <SafeIcon name="Phone" size={16} className="mr-2" />
                        Call Candidate
                      </a>
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {application.candidatePhone
                      ? "Click to contact the candidate via email or phone."
                      : "Click to send an email to the candidate directly."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <CommonFooter variant="full" />
      <ScrollToTop />
    </BaseLayout>
  );
}
