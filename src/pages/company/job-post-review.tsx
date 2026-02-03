import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import JobPostReviewContent from "@/sections/company/job-post-review/JobPostReviewContent";

export const JobPostReview: React.FC = () => {
  return (
    <BaseLayout title="Review Job Posting - JobCenter">
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
        <CommonHeader variant="company" />

        <main className="flex-1">
          <JobPostReviewContent />
        </main>

        <CommonFooter variant="simple" />
      </div>
    </BaseLayout>
  );
};
