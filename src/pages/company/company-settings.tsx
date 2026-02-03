import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CompanySettingsLayout from "@/sections/company/company-settings/CompanySettingsLayout";

export const CompanySettings: React.FC = () => {
  return (
    <BaseLayout title="Company Settings - JobCenter">
      <CommonHeader variant="company" />
      <CompanySettingsLayout currentPage="/company-settings" />
    </BaseLayout>
  );
};

