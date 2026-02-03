import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import JobPostConfirmationContent from "@/sections/company/job-post-confirmation/JobPostConfirmationContent";

export const JobPostConfirmation: React.FC = () => {
  return (
    <BaseLayout title="Job Posted Successfully - JobCenter">
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="company" />

        <main className="flex-1">
          <JobPostConfirmationContent />
        </main>

        <CommonFooter variant="simple" />
      </div>
    </BaseLayout>
  );
};
