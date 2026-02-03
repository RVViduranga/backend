import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ApplicationsLayout from "@/sections/company/company-applications/ApplicationsLayout";

export const CompanyApplications: React.FC = () => {
  return (
    <BaseLayout title="Applications - JobCenter">
      <CommonHeader variant="company" />
      <ApplicationsLayout currentPage="/company-applications" />
    </BaseLayout>
  );
};

