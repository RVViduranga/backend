import { useParams } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import JobBreadcrumb from "@/sections/job/job-details/JobBreadcrumb";
import JobNotFound from "@/sections/job/job-details/JobNotFound";
import JobDetailsHeader from "@/sections/job/job-details/JobDetailsHeader";
import JobDetailsContent from "@/sections/job/job-details/JobDetailsContent";
import CompanyCard from "@/sections/job/job-details/CompanyCard";
import JobMetadata from "@/sections/job/job-details/JobMetadata";
import RelatedJobs from "@/sections/job/job-details/RelatedJobs";
import JobDetailsActions from "@/sections/job/job-details/JobDetailsActions";
import { useJobQuery } from "@/hooks/queries/use-job-query";
import { Loader2 } from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading, isError } = useJobQuery({ jobId: id });

  // Loading state - initial load
  if (isLoading) {
    return (
      <BaseLayout
        title="Loading Job Details - JobCenter"
        description="Loading job information"
      >
        <div className="flex flex-col min-h-screen">
          <CommonHeader variant="default" />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          </main>
        </div>
      </BaseLayout>
    );
  }

  // Error state or job not found
  if (isError || !job) {
    return (
      <BaseLayout title="Job Not Found - JobCenter" description="Job not found">
        <div className="flex flex-col min-h-screen">
          <CommonHeader variant="default" />
          <main className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <JobNotFound />
            </div>
          </main>
          <CommonFooter variant="full" />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title={`${job.title} - JobCenter`}
      description={`View detailed information about ${job.title} at ${job.company.name}`}
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <JobBreadcrumb />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <JobDetailsHeader />
                <JobDetailsContent />
                <CompanyCard />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <JobMetadata />
                <JobDetailsActions />
              </div>
            </div>

            {/* Related Jobs Section */}
            <div className="mt-16">
              <RelatedJobs />
            </div>
          </div>
        </main>
        <CommonFooter variant="full" />
        <ScrollToTop />
      </div>
    </BaseLayout>
  );
}
