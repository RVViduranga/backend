import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import JobSearchContent from "@/sections/job/job-search/JobSearchContent";

export default function JobSearchPageWrapper() {
  return (
    <BaseLayout
      title="Job Search - JobCenter"
      description="Search and find your next job opportunity"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <JobSearchContent />
        </main>
        <CommonFooter variant="full" />
      </div>
    </BaseLayout>
  );
}
