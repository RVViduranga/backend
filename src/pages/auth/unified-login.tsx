import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import AuthLayout from "@/components/common/auth-layout";
import UnifiedLoginForm from "@/sections/auth/unified-login/UnifiedLoginForm";

export const UnifiedLogin: React.FC = () => {
  return (
    <BaseLayout title="Login - JobCenter">
      <AuthLayout
        title="Welcome Back"
        description="Log in to your account to continue"
        showBranding={true}
      >
        <UnifiedLoginForm />
      </AuthLayout>
    </BaseLayout>
  );
};


