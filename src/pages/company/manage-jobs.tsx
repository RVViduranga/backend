import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ManageJobsLayout from "@/sections/company/manage-jobs/ManageJobsLayout";

export const ManageJobs: React.FC = () => {
  return (
    <BaseLayout title="Manage Jobs - JobCenter">
      <CommonHeader variant="company" />
      <ManageJobsLayout currentPage="/manage-jobs" />
    </BaseLayout>
  );
};
