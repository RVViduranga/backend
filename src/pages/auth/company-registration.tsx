import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import CompanyRegistrationForm from "@/sections/auth/company-registration/CompanyRegistrationForm";

export const CompanyRegistration: React.FC = () => {
  return (
    <BaseLayout title="Company Registration - JobCenter">
      <CommonHeader variant="default" />

      <main className="flex-1">
        <CompanyRegistrationForm />
      </main>

      <CommonFooter variant="simple" />
    </BaseLayout>
  );
};
