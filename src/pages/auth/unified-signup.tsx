import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import UnifiedSignupContent from "@/sections/auth/unified-signup/UnifiedSignupContent";

export const UnifiedSignup: React.FC = () => {
  return (
    <BaseLayout title="Sign Up - JobCenter">
      <UnifiedSignupContent />
    </BaseLayout>
  );
};


