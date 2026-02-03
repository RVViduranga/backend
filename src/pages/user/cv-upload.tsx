import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import CVUploadForm from "@/sections/user/cv-upload/CVUploadForm";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

export const CVUpload: React.FC = () => {
  return (
    <BaseLayout title="Upload CV - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/cv-upload">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Back Button */}
            <Button variant="ghost" asChild className="-ml-2">
              <Link to="/cv-management" className="flex items-center gap-2">
                <SafeIcon name="ArrowLeft" size={18} />
                <span>Back to CV Management</span>
              </Link>
            </Button>

            {/* Page Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Upload Your CV</h1>
              <p className="text-muted-foreground text-base">
                Add a new resume or upload a different version. You can manage multiple CVs and select which one to use for applications.
              </p>
            </div>

            {/* Upload Form */}
            <CVUploadForm />
          </div>
        </div>
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
