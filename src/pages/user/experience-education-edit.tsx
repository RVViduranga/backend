import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ExperienceEducationPage from "@/sections/user/experience-education-edit/ExperienceEducationPage";

export const ExperienceEducationEdit: React.FC = () => {
  return (
    <BaseLayout title="Edit Experience & Education - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/experience-education-edit">
        <ExperienceEducationPage />
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
