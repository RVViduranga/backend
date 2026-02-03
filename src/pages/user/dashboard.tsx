import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import UserDashboardLayout from "@/sections/user/user-dashboard/UserDashboardLayout";

export const UserDashboard: React.FC = () => {
  return (
    <BaseLayout title="User Dashboard - JobCenter">
      <CommonHeader variant="authenticated" />
      <UserDashboardLayout currentPage="/user-dashboard" />
    </BaseLayout>
  );
};
