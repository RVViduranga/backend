import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CVManagementWrapper from "@/sections/user/cv-management/CVManagementWrapper";

export const CVManagement: React.FC = () => {
  return (
    <BaseLayout title="CV Management - JobCenter">
      <CommonHeader variant="authenticated" />
      <CVManagementWrapper currentPage="/cv-management" />
    </BaseLayout>
  );
};
