import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import CompaniesContent from "@/sections/company/companies/CompaniesContent";

export default function CompaniesPage() {
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

