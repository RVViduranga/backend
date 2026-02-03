import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import JobApplicationForm from "@/sections/job/job-apply-form/JobApplicationForm";
import ScrollToTop from "@/components/common/scroll-to-top";

export default function JobApplicationPage() {
  return (
    <BaseLayout
      title="Apply for Job - JobCenter"
      description="Submit your application for this job opportunity"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1 container mx-auto px-4 py-8">
          <JobApplicationForm />
        </main>
        <CommonFooter variant="full" />
        <ScrollToTop />
      </div>
    </BaseLayout>
  );
}

