import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import UserSettingsLayout from "@/sections/user/user-settings/UserSettingsLayout";

export const UserSettings: React.FC = () => {
  return (
    <BaseLayout title="Settings - JobCenter">
      <CommonHeader variant="authenticated" />
      <UserSettingsLayout currentPage="/user-settings" />
    </BaseLayout>
  );
};

