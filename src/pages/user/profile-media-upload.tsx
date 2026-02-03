import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ProfileMediaUploadForm from "@/sections/user/profile-media-upload/ProfileMediaUploadForm";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

export const ProfileMediaUpload: React.FC = () => {
  return (
    <BaseLayout title="Upload CV & Media - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/profile-media-upload">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-sm text-muted-foreground"
              aria-label="Breadcrumb"
            >
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
              >
                <Link to="/user-profile-setup">Profile Setup</Link>
              </Button>
              <SafeIcon
                name="ChevronRight"
                size={14}
                className="text-muted-foreground"
              />
              <span className="text-foreground font-medium">
                Upload Documents
              </span>
            </nav>

            {/* Main Content */}
            <ProfileMediaUploadForm />
          </div>
        </div>
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
