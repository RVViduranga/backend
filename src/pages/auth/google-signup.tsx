import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import AuthLayout from "@/components/common/auth-layout";
import GoogleSignupForm from "@/sections/auth/google-signup/GoogleSignupForm";

export const GoogleSignup: React.FC = () => {
  return (
    <BaseLayout title="Sign Up with Google - JobCenter">
      <AuthLayout
        title="Create Your Account"
        description="Sign up with Google to get started"
        showBranding={true}
      >
        <GoogleSignupForm />
      </AuthLayout>
    </BaseLayout>
  );
};
