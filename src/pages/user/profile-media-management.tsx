import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ProfileMediaManagementWrapper from "@/sections/user/profile-media-management/ProfileMediaManagementWrapper";

export const ProfileMediaManagementPage: React.FC = () => {
  return (
    <BaseLayout title="Profile Media Management - JobCenter">
      <CommonHeader variant="authenticated" />
      <ProfileMediaManagementWrapper currentPage="/profile-media-management" />
    </BaseLayout>
  );
};
