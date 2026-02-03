import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CVViewLayout from "@/sections/user/cv-view/CVViewLayout";

export const CVView: React.FC = () => {
  return (
    <BaseLayout title="View CV - JobCenter">
      <CommonHeader variant="authenticated" />

      <CVViewLayout />
    </BaseLayout>
  );
};
