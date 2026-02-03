import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ContactInfoEditForm from "@/sections/user/contact-info-edit/ContactInfoEditForm";

export const ContactInfoEdit: React.FC = () => {
  return (
    <BaseLayout title="Edit Contact Information - JobCenter">
      <CommonHeader variant="authenticated" />
      <ClientSidebarWrapper variant="user" currentPage="/contact-info-edit">
        <ContactInfoEditForm />
      </ClientSidebarWrapper>
    </BaseLayout>
  );
};
