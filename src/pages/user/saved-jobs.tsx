import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import SavedJobsLayout from "@/sections/user/saved-jobs/SavedJobsLayout";

export const SavedJobs: React.FC = () => {
  return (
    <BaseLayout title="Saved Jobs - JobCenter">
      <CommonHeader variant="authenticated" />
      <SavedJobsLayout currentPage="/saved-jobs" />
    </BaseLayout>
  );
};

