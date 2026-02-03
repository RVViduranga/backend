import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import JobCard from "@/components/common/job-card";
import { useCompanyDetailQuery } from "@/hooks/queries/use-company-detail-query";
import { useJobSearchQuery } from "@/hooks/queries/use-job-search-query";
import { Loader2 } from "lucide-react";

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Fetch company details
  const {
    company,
    isLoading: isLoadingCompany,
    isError: isCompanyError,
    error: companyError,
  } = useCompanyDetailQuery({
    companyId: id,
  });

  // Fetch all jobs to filter for this company's active jobs
  const { searchResults: allJobs } = useJobSearchQuery({
    params: {
      sortBy: "recent",
      limit: 1000, // Get enough jobs to filter
    },
    enabled: !!company, // Only fetch jobs if company is loaded
  });

  // Filter jobs for this company that are active
  const activeJobs = useMemo(() => {
    if (!id || !allJobs) return [];
    return allJobs.filter(
      (job) => job.company.id === id && job.status === "Active"
    );
  }, [id, allJobs]);

  const isLoading = isLoadingCompany;
  const error = isCompanyError
    ? companyError?.message || "Failed to load company details"
    : null;

  // Loading state
  if (isLoading) {
    return (
      <BaseLayout title="Loading Company - JobCenter">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        </main>
      </BaseLayout>
    );
  }

  // Error state or company not found
  if (isCompanyError || !company) {
    return (
      <BaseLayout title="Company Not Found - JobCenter">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="py-12 text-center">
                <SafeIcon
                  name="Building2"
                  size={48}
                  className="mx-auto mb-4 text-muted-foreground"
                />
                <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  {error || "The company you're looking for doesn't exist."}
                </p>
                <Button asChild>
                  <Link to="/companies">Browse Companies</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      title={`${company.name} - JobCenter`}
      description={`View company profile, job openings, and career opportunities at ${company.name}`}
    >
      <CommonHeader variant="default" />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link
                to="/companies"
                className="hover:text-foreground transition-colors"
              >
                Companies
              </Link>
              <SafeIcon name="ChevronRight" size={16} />
              <span className="text-foreground">{company.name}</span>
            </div>
          </nav>

          {/* Company Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={company.logo || company.logoUrl || ""}
                    alt={company.name}
                    className="w-24 h-24 rounded-lg object-cover border-2"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-3xl mb-2">
                        {company.name}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm">
                          {(company as typeof company & { industry?: string }).industry || "N/A"}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <SafeIcon name="Briefcase" size={16} />
                          {activeJobs.length} Active Jobs
                        </span>
                      </div>
                    </div>
                    {company.website && (
                      <Button variant="outline" asChild>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <SafeIcon
                            name="ExternalLink"
                            size={16}
                            className="mr-2"
                          />
                          Visit Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {company.description && (
                <p className="text-foreground leading-relaxed mb-6">
                  {company.description}
                </p>
              )}

              {/* Company Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                {(company.address || company.headquarters) && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Headquarters
                    </p>
                    <p className="font-medium flex items-center gap-2">
                      <SafeIcon name="MapPin" size={16} />
                      {company.address || company.headquarters}
                    </p>
                  </div>
                )}
                {company.establishedYear && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Founded</p>
                    <p className="font-medium">
                      {company.establishedYear}
                    </p>
                  </div>
                )}
                {company.employeeCountRange && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Company Size
                    </p>
                    <p className="font-medium">
                      {company.employeeCountRange}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{(company as typeof company & { industry?: string }).industry || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Jobs Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Open Positions</h2>
                <p className="text-muted-foreground">
                  {activeJobs.length > 0
                    ? `Browse ${activeJobs.length} job${
                        activeJobs.length > 1 ? "s" : ""
                      } at ${company.name}`
                    : `No open positions at ${company.name} at the moment`}
                </p>
              </div>
            </div>

            {activeJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    variant="compact"
                    job={{
                      id: job.id,
                      title: job.title,
                      company: job.company.name,
                      location: job.location,
                      type: job.jobType,
                      postedDate: job.postedDate,
                      experienceLevel: job.experienceLevel,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <SafeIcon
                    name="Briefcase"
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <CardDescription className="text-lg">
                    No open positions available at this time
                  </CardDescription>
                  <Button variant="outline" className="mt-4" asChild>
                    <Link to="/jobs">Browse All Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Back to Companies */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/companies">
                <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
                Back to Companies
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <CommonFooter variant="full" />
      <ScrollToTop />
    </BaseLayout>
  );
}
