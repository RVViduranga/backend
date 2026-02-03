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
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/safe-icon";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { Loader2 } from "lucide-react";

interface ApplicationData {
  jobTitle: string;
  company: string;
  location: string;
  applicationDate: string;
  referenceNumber: string;
  estimatedResponse: string;
}

export default function ConfirmationContent() {
  const location = useLocation();
  const state = location.state as { jobId?: string; jobTitle?: string } | null;
  const { job, isLoading } = useJobQuery({ jobId: state?.jobId });

  const applicationData: ApplicationData = {
    jobTitle: state?.jobTitle || job?.title || "Job Application",
    company: job?.company.name || "Company",
    location: job?.location || "Location",
    applicationDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    referenceNumber: `APP-${Date.now()}`,
    estimatedResponse: "5-7 business days",
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <SafeIcon
                name="CheckCircle2"
                size={48}
                color="hsl(142.1 76.2% 36.3%)"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">Application Submitted!</h1>
          <p className="text-xl text-muted-foreground">
            Your application has been successfully submitted. We'll review it
            and get back to you soon.
          </p>
        </div>

        {/* Application Summary Card */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Application Summary</CardTitle>
            <CardDescription>Here's what you applied for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  Position
                </h3>
                <p className="text-lg font-semibold">
                  {applicationData.jobTitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Company
                  </h3>
                  <p className="text-base font-medium">
                    {applicationData.company}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Location
                  </h3>
                  <p className="text-base font-medium flex items-center gap-2">
                    <SafeIcon name="MapPin" size={16} />
                    {applicationData.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Application Date
                  </h3>
                  <p className="text-base font-medium flex items-center gap-2">
                    <SafeIcon name="Calendar" size={16} />
                    {applicationData.applicationDate}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                    Reference Number
                  </h3>
                  <p className="text-base font-mono font-medium">
                    {applicationData.referenceNumber}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* What Happens Next */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex gap-3">
                <SafeIcon
                  name="Info"
                  size={20}
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    What Happens Next?
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    The hiring team will review your application and contact you
                    within{" "}
                    <span className="font-semibold">
                      {applicationData.estimatedResponse}
                    </span>
                    . Keep an eye on your email for updates.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Check Your Email</h4>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your application
                    details and reference number.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">
                    Keep Your Profile Updated
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Make sure your profile information and CV are up-to-date for
                    future opportunities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Continue Exploring</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse more job listings and apply to positions that match
                    your skills and interests.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mb-8 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SafeIcon
                name="Lightbulb"
                size={20}
                className="text-amber-600 dark:text-amber-400"
              />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>Follow up after 2 weeks if you haven't heard back</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>
                  Keep applying to other positions to increase your chances
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>
                  Check your spam folder for email updates from the company
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1" asChild>
            <Link to="/jobs">
              <SafeIcon name="Search" size={18} className="mr-2" />
              Browse More Jobs
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="flex-1" asChild>
            <Link to="/user-applications">
              <SafeIcon name="FileText" size={18} className="mr-2" />
              View My Applications
            </Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Need help? Check out our{" "}
            <Link
              to="/resources"
              className="text-primary hover:underline font-semibold"
            >
              FAQ
            </Link>{" "}
            or{" "}
            <Link
              to="/contact"
              className="text-primary hover:underline font-semibold"
            >
              contact support
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            Reference: {applicationData.referenceNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
