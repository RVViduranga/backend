import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import AuthLayout from "@/components/common/auth-layout";
import EmailSignupForm from "@/sections/auth/email-signup/EmailSignupForm";

export const EmailSignup: React.FC = () => {
  return (
    <BaseLayout title="Sign Up with Email - JobCenter">
      <AuthLayout
        title="Create Your Account"
        description="Join JobCenter and start your job search journey"
        showBranding={true}
      >
        <EmailSignupForm />
      </AuthLayout>
    </BaseLayout>
  );
};
