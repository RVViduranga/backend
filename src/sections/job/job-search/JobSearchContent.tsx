import { useState, useMemo } from "react";
import type { JobSummaryModel } from "@/models/jobPosts";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import SearchResultsHeader from "./SearchResultsHeader";
import JobListingGrid from "./JobListingGrid";
import EmptySearchState from "./EmptySearchState";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";
import { useJobSearchQuery } from "@/hooks/queries/use-job-search-query";
import { useFilterOptionsQuery } from "@/hooks/queries/use-filter-options-query";
import { Loader2 } from "lucide-react";
import {
  LOCATION_OPTIONS,
  INDUSTRY_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  JOB_TYPE_OPTIONS,
  POPULAR_SEARCH_TERMS,
} from "@/constants/job-forms";

interface FilterState {
  location: string[];
  industry: string[];
  experienceLevel: string[];
  jobType: string[];
  salaryMin: number | null;
  salaryMax: number | null;
}

export default function JobSearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    location: [],
    industry: [],
    experienceLevel: [],
    jobType: [],
    salaryMin: null,
    salaryMax: null,
  });
  const [sortBy, setSortBy] = useState<"recent" | "relevant">("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Build search params - memoized to prevent unnecessary re-renders
  const searchParams = useMemo(
    () => ({
      query: searchQuery || undefined,
      location: filters.location.length > 0 ? filters.location : undefined,
      industry: filters.industry.length > 0 ? filters.industry : undefined,
      experienceLevel:
        filters.experienceLevel.length > 0
          ? filters.experienceLevel
          : undefined,
      jobType: filters.jobType.length > 0 ? filters.jobType : undefined,
      salaryMin: filters.salaryMin || undefined,
      salaryMax: filters.salaryMax || undefined,
      sortBy,
      page,
      limit,
    }),
    [searchQuery, filters, sortBy, page, limit]
  );

  // Use TanStack Query hook - automatically refetches when params change
  const {
    searchResults,
    searchTotal,
    isSearching,
    isLoading,
    error: searchError,
  } = useJobSearchQuery({
    params: searchParams,
  });

  // Fetch filter options from service (with fallback to constants)
  const { filterOptions: filterOptionsData } = useFilterOptionsQuery();
  
  // Use service data if available, otherwise fallback to constants
  const filterOptions = {
    locations: filterOptionsData?.locations || [...LOCATION_OPTIONS],
    industries: filterOptionsData?.industries || [...INDUSTRY_OPTIONS],
    experienceLevel: filterOptionsData?.experienceLevels || [...EXPERIENCE_LEVEL_OPTIONS],
    jobType: filterOptionsData?.jobTypes || [...JOB_TYPE_OPTIONS],
  };

  // Use search results directly (filtering is handled by the service)
  const filteredJobs = searchResults;

  const handleFilterChange = (filterType: keyof FilterState, value: string | string[] | number | null) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: [],
      industry: [],
      experienceLevel: [],
      jobType: [],
      salaryMin: null,
      salaryMax: null,
    });
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilters({
      location: [],
      industry: [],
      experienceLevel: [],
      jobType: [],
      salaryMin: null,
      salaryMax: null,
    });
    setPage(1); // Reset to first page
  };

  const activeFilterCount =
    [
      ...filters.location,
      ...filters.industry,
      ...filters.experienceLevel,
      ...filters.jobType,
    ].length +
    (filters.salaryMin ? 1 : 0) +
    (filters.salaryMax ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col">
      {/* Search Bar Section */}
      <div className="bg-gradient-to-b from-primary/5 via-primary/3 to-transparent border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Find Your Next Opportunity
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search through thousands of job listings from top companies in Sri
              Lanka
            </p>

            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">500+</span>{" "}
                  Companies
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">5,000+</span>{" "}
                  Job Listings
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">100+</span>{" "}
                  New Daily
                </span>
              </div>
            </div>

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {
                // Focus on results when search is triggered
                // Real-time search already happens, this is for UX feedback
                document
                  .getElementById("job-results")
                  ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
            />

            {/* Popular Searches */}
            {!searchQuery && filteredJobs.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Popular Searches:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {POPULAR_SEARCH_TERMS.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setSearchQuery(term)}
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              filterOptions={filterOptions}
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
                  <SafeIcon name="Filter" size={18} />
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
                />
              </Button>
            </div>

            {/* Mobile Filter Panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 p-4 border rounded-lg bg-card">
                <FilterSidebar
                  filterOptions={filterOptions}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  activeFilterCount={activeFilterCount}
                  onClearFilters={handleClearFilters}
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {searchError && !isLoading && (
              <div className="py-12 text-center">
                <p className="text-destructive mb-4">
                  Failed to load jobs. Please try again.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            )}

            {/* Results Header */}
            {!isLoading && !searchError && (
              <SearchResultsHeader
                resultCount={searchTotal}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            )}

            {/* Job Listings */}
            {!isLoading && !searchError && (
              <div id="job-results" className="scroll-mt-4">
                {filteredJobs.length > 0 ? (
                  <>
                    <JobListingGrid jobs={filteredJobs} viewMode={viewMode} />
                    {/* Show loading indicator while fetching in background */}
                    {isSearching && !isLoading && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="ml-2 text-sm text-muted-foreground">
                          Updating results...
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <EmptySearchState
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
