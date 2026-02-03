import { useState, useMemo } from "react";
import type { CompanyDetailModel } from "@/models/company";
import CompaniesSearchBar from "./CompaniesSearchBar";
import CompaniesFilterSidebar from "./CompaniesFilterSidebar";
import CompaniesResultsHeader from "./CompaniesResultsHeader";
import CompaniesGrid from "./CompaniesGrid";
import EmptyCompaniesState from "./EmptyCompaniesState";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { useCompaniesQuery } from "@/hooks/queries/use-companies-query";
import { Loader2 } from "lucide-react";
import { INDUSTRY_OPTIONS } from "@/constants/job-forms";

interface FilterState {
  industry: string[];
}

export default function CompaniesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    industry: [],
  });
  const [sortBy, setSortBy] = useState<"name" | "jobs">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Build query params - memoized to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      industry: filters.industry.length > 0 ? filters.industry[0] : undefined,
      page: 1,
      limit: 100, // Get all companies for client-side sorting
    }),
    [searchQuery, filters]
  );

  // Use TanStack Query hook - automatically refetches when params change
  const {
    companies,
    isLoading,
    isFetching,
    isError,
    error: queryError,
  } = useCompaniesQuery({
    params: queryParams,
  });

  // Filter and search logic (client-side filtering until backend supports it)
  const filteredCompanies = useMemo(() => {
    let results = [...companies];

    // Search by keyword
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((company) => {
        const companyWithIndustry = company as CompanyDetailModel & {
          industry?: string;
        };
        return (
          company.name.toLowerCase().includes(query) ||
          (companyWithIndustry.industry &&
            companyWithIndustry.industry.toLowerCase().includes(query))
        );
      });
    }

    // Apply filters
    if (filters.industry.length > 0) {
      results = results.filter((company) => {
        const companyWithIndustry = company as CompanyDetailModel & {
          industry?: string;
        };
        return (
          companyWithIndustry.industry &&
          filters.industry.includes(companyWithIndustry.industry)
        );
      });
    }

    // Sort results
    if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "jobs") {
      results.sort((a, b) => {
        const aJobs =
          (a as unknown as { activeJobsCount?: number }).activeJobsCount || 0;
        const bJobs =
          (b as unknown as { activeJobsCount?: number }).activeJobsCount || 0;
        return bJobs - aJobs;
      });
    }

    return results;
  }, [companies, searchQuery, filters, sortBy]);

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      industry: [],
    });
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilters({
      industry: [],
    });
  };

  const activeFilterCount = useMemo(() => filters.industry.length, [filters]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (isError && queryError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-6">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Failed to load companies. Please try again.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar Section */}
      <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Discover Top Companies</h1>
            <p className="text-muted-foreground mb-6">
              Explore leading companies and find your next career opportunity
            </p>
            <CompaniesSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {
                document
                  .getElementById("companies-results")
                  ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <CompaniesFilterSidebar
              filterOptions={{ industries: [...INDUSTRY_OPTIONS] }}
              filters={filters}
              onFilterChange={handleFilterChange}
              activeFilterCount={activeFilterCount}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                <span className="flex items-center gap-2">
                  <SafeIcon name="Filter" size={18} aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </span>
                <SafeIcon
                  name={mobileFilterOpen ? "ChevronUp" : "ChevronDown"}
                  size={18}
                  aria-hidden="true"
                />
              </Button>
            </div>

            {/* Mobile Filter Panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 p-4 border rounded-lg bg-card">
                <CompaniesFilterSidebar
                  filterOptions={{ industries: [...INDUSTRY_OPTIONS] }}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  activeFilterCount={activeFilterCount}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}
            {/* Results Header */}
            {!isLoading && (
              <CompaniesResultsHeader
                resultCount={filteredCompanies.length}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* Companies List */}
            {!isLoading && (
              <div id="companies-results" className="scroll-mt-4">
                {filteredCompanies.length > 0 ? (
                  <>
                    <CompaniesGrid
                      companies={
                        filteredCompanies.map((c) => ({
                          id: c.id,
                          name: c.name,
                          logoUrl: c.logoUrl,
                          industry:
                            (c as unknown as { industry?: string }).industry || "",
                          activeJobsCount:
                            (c as unknown as { activeJobsCount?: number })
                              .activeJobsCount || 0,
                          totalApplicationsReceived:
                            (c as unknown as { totalApplicationsReceived?: number })
                              .totalApplicationsReceived || 0,
                        })) as import("@/models/company").CompanySummaryModel[]
                      }
                      viewMode={viewMode}
                    />
                    {/* Show loading indicator while fetching in background */}
                    {isFetching && !isLoading && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Updating results...
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptyCompaniesState
                    searchQuery={searchQuery}
                    hasFilters={activeFilterCount > 0}
                    onClearFilters={handleClearFilters}
                    onResetSearch={handleResetSearch}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
