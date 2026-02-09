import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import JobSearchContent from "@/sections/job/job-search/JobSearchContent";
import { useAuth } from "@/hooks/use-auth-context";

export default function JobSearchPageWrapper() {
  const { isAuthenticated, user } = useAuth();
  const isCompany = user?.userType === "company";

  // Show sidebar for authenticated users, full page for public users
  if (isAuthenticated) {
    return (
      <BaseLayout
        title="Job Search - JobCenter"
        description="Search and find your next job opportunity"
      >
        <CommonHeader variant={isCompany ? "company" : "authenticated"} />
        <ClientSidebarWrapper variant={isCompany ? "company" : "user"} currentPage="/jobs">
          <JobSearchContent />
        </ClientSidebarWrapper>
      </BaseLayout>
    );
  }

  // Public page without sidebar
  return (
    <BaseLayout
      title="Job Search - JobCenter"
      description="Search and find your next job opportunity"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <JobSearchContent />
        </main>
        <CommonFooter variant="full" />
      </div>
    </BaseLayout>
  );
}
