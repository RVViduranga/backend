import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import CompaniesContent from "@/sections/company/companies/CompaniesContent";
import { useAuth } from "@/hooks/use-auth-context";

export default function CompaniesPage() {
  const { isAuthenticated, user } = useAuth();
  const isCompany = user?.userType === "company";

  // Show sidebar for authenticated users, full page for public users
  if (isAuthenticated) {
    return (
      <BaseLayout
        title="Companies - JobCenter"
        description="Discover top companies and explore career opportunities"
      >
        <CommonHeader variant={isCompany ? "company" : "authenticated"} />
        <ClientSidebarWrapper variant={isCompany ? "company" : "user"} currentPage="/companies">
          <CompaniesContent />
        </ClientSidebarWrapper>
      </BaseLayout>
    );
  }

  // Public page without sidebar
  return (
    <BaseLayout
      title="Companies - JobCenter"
      description="Discover top companies and explore career opportunities"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <CompaniesContent />
        </main>
        <CommonFooter variant="full" />
      </div>
    </BaseLayout>
  );
}

