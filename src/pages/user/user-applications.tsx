import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import UserApplicationsLayout from "@/sections/user/user-applications/UserApplicationsLayout";

export const UserApplications: React.FC = () => {
  return (
    <BaseLayout title="My Applications - JobCenter">
      <CommonHeader variant="authenticated" />
      <UserApplicationsLayout currentPage="/user-applications" />
    </BaseLayout>
  );
};

