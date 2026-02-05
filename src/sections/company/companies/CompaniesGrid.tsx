import type { CompanyDetailModel, CompanySummaryModel } from "@/models/companies";
import CompanyCard from "@/components/common/company-card";

interface CompaniesGridProps {
  companies: (CompanyDetailModel | CompanySummaryModel)[];
  viewMode: "grid" | "list";
}

// Helper to convert CompanyDetailModel to CompanySummaryModel for CompanyCard
function toCompanySummary(
  company: CompanyDetailModel | CompanySummaryModel
): CompanySummaryModel {
  if ("activeJobsCount" in company && "totalApplicationsReceived" in company) {
    return company as CompanySummaryModel;
  }
  // Convert CompanyDetailModel to CompanySummaryModel
  const detail = company as CompanyDetailModel;
  return {
    id: detail.id,
    name: detail.name,
    logoUrl: detail.logoUrl,
    activeJobsCount: 0, // Will be calculated by backend
    totalApplicationsReceived: 0, // Will be calculated by backend
    industry: (detail as unknown as { industry?: string }).industry || "",
  };
}

export default function CompaniesGrid({
  companies,
  viewMode,
}: CompaniesGridProps) {
  if (viewMode === "list") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
        {companies.map((company, index) => (
          <div
            key={company.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CompanyCard company={toCompanySummary(company)} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {companies.map((company, index) => (
        <div
          key={company.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CompanyCard company={toCompanySummary(company)} />
        </div>
      ))}
    </div>
  );
}







