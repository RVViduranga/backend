import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ProjectsWorkSamplesContent from "@/sections/user/projects-work-samples/ProjectsWorkSamplesContent";

export const ProjectsWorkSamples: React.FC = () => {
  return (
    <BaseLayout title="Projects & Work Samples - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/projects-work-samples">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <ProjectsWorkSamplesContent />
          </div>
        </div>
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
