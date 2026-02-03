import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import PortfolioUploadContent from "@/sections/user/portfolio-upload/PortfolioUploadContent";

export const PortfolioUpload: React.FC = () => {
  return (
    <BaseLayout title="Upload Portfolio - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/portfolio-upload">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <PortfolioUploadContent />
          </div>
        </div>
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
