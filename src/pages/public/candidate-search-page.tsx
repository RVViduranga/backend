import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import ScrollToTop from "@/components/common/scroll-to-top";
import CandidateSearchContent from "@/sections/public/candidate-search/CandidateSearchContent";
import { useAuth } from "@/hooks/use-auth-context";

export default function CandidateSearchPage() {
  const { isAuthenticated, user } = useAuth();
  const isCompany = user?.userType === "company";

  // Show sidebar for authenticated users, full page for public users
  if (isAuthenticated) {
    return (
      <BaseLayout
        title="Find Candidates - JobCenter"
        description="Search for talented professionals and candidates"
      >
        <CommonHeader variant={isCompany ? "company" : "authenticated"} />
        <ClientSidebarWrapper variant={isCompany ? "company" : "user"} currentPage="/candidates">
          <CandidateSearchContent />
        </ClientSidebarWrapper>
        <ScrollToTop />
      </BaseLayout>
    );
  }

  // Public page without sidebar
  return (
    <BaseLayout
      title="Find Candidates - JobCenter"
      description="Search for talented professionals and candidates"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <CandidateSearchContent />
        </main>
        <CommonFooter variant="full" />
        <ScrollToTop />
      </div>
    </BaseLayout>
  );
}
