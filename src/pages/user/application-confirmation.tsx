import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ConfirmationContent from "@/sections/job/application-confirmation/ConfirmationContent";

export const ApplicationSubmitted: React.FC = () => {
  return (
    <BaseLayout title="Application Submitted - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/application-confirmation">
        <ConfirmationContent />
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
