import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CompanyProfileEditLayout from "@/sections/company/company-profile-edit/CompanyProfileEditLayout";

export const CompanyProfileEdit: React.FC = () => {
  return (
    <BaseLayout title="Edit Company Profile - JobCenter">
      <CommonHeader variant="company" />
      <CompanyProfileEditLayout currentPage="/company-profile-edit" />
    </BaseLayout>
  );
};

