import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import PersonalDetailsEditWrapper from "@/sections/user/personal-details-edit/PersonalDetailsEditWrapper";

export const PersonalDetailsEdit: React.FC = () => {
  return (
    <BaseLayout title="Edit Personal Details - JobCenter">
      <CommonHeader variant="authenticated" />
      <PersonalDetailsEditWrapper currentPage="/personal-details-edit" />
    </BaseLayout>
  );
};
