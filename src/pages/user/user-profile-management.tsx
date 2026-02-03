import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ProfileWrapper from "@/sections/user/user-profile-management/ProfileWrapper";

export const ProfileManagement: React.FC = () => {
  return (
    <BaseLayout title="Profile Management - JobCenter">
      <CommonHeader variant="authenticated" />
      <ProfileWrapper currentPage="/user-profile-management" />
    </BaseLayout>
  );
};
