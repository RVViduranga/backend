import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ProfileForm from "@/sections/user/user-profile-setup/ProfileForm";

export const ProfileSetup: React.FC = () => {
  return (
    <BaseLayout title="Profile Setup - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/user-profile-setup">
        <ProfileForm />
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
