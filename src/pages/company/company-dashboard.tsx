import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import DashboardLayout from "@/sections/company/company-dashboard/DashboardLayout";

export const CompanyDashboard: React.FC = () => {
  return (
    <BaseLayout title="Company Dashboard - JobCenter">
      <CommonHeader variant="company" />
      <DashboardLayout variant="company" currentPage="/company-dashboard" />
    </BaseLayout>
  );
};
