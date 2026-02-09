import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ProfileViewContent from "@/sections/user/user-profile-view/ProfileViewContent";

export const ProfileView: React.FC = () => {
  return (
    <BaseLayout title="My Profile - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/user-profile-view">
        <ProfileViewContent />
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
