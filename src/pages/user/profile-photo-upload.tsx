import React from "react";
import { Link } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ProfilePhotoUploadForm from "@/sections/user/profile-photo-upload/ProfilePhotoUploadForm";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

export const ProfilePhotoUpload: React.FC = () => {
  return (
    <BaseLayout title="Upload Profile Photo - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/profile-photo-upload">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Button variant="ghost" asChild size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                <Link to="/user-profile-management">Profile Management</Link>
              </Button>
              <SafeIcon name="ChevronRight" size={14} className="text-muted-foreground" />
              <Button variant="ghost" asChild size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                <Link to="/profile-media-management">Media Management</Link>
              </Button>
              <SafeIcon name="ChevronRight" size={14} className="text-muted-foreground" />
              <span className="text-foreground font-medium">Upload Profile Photo</span>
            </nav>

            {/* Page Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Upload Profile Photo</h1>
              <p className="text-muted-foreground text-base">
                Add a professional profile picture to make your application stand out to employers.
              </p>
            </div>

            {/* Upload Form */}
            <ProfilePhotoUploadForm />
          </div>
        </div>
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
