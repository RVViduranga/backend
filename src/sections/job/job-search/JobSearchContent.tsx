import { useState, useMemo, useEffect } from "react";
import type { JobSummaryModel } from "@/models/jobPosts";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import SearchResultsHeader from "./SearchResultsHeader";
import JobListingGrid from "./JobListingGrid";
import EmptySearchState from "./EmptySearchState";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SafeIcon from "@/components/common/safe-icon";
import { useJobSearchQuery } from "@/hooks/queries/use-job-search-query";
import { useFilterOptionsQuery } from "@/hooks/queries/use-filter-options-query";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
    page: currentPage,
    totalPages,
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
    setPage(1); // Reset to first page when filters change
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
    setPage(1); // Reset to first page when clearing filters
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

  // Reset to page 1 when search query changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Scroll to top of results when page changes
  useEffect(() => {
    const resultsElement = document.getElementById("job-results");
    if (resultsElement && page > 1) {
      resultsElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7; // Show max 7 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (page <= 4) {
        // Near the beginning: show 1, 2, 3, 4, 5, ..., last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        // Near the end: show 1, ..., last-4, last-3, last-2, last-1, last
        pages.push("ellipsis");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle: show 1, ..., current-1, current, current+1, ..., last
        pages.push("ellipsis");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
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
    <div className="flex-1 flex flex-col bg-background min-h-0">
      {/* Hero Section - Fixed at Top */}
      <div className="border-b bg-gradient-to-b from-card to-background flex-shrink-0 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Find Your Next Opportunity
            </h1>
            <p className="text-base text-muted-foreground">
              Discover thousands of job listings from top companies worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => {
                document
                  .getElementById("job-results")
                  ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
            />
          </div>

          {/* Popular Searches */}
          {!searchQuery && filteredJobs.length > 0 && (
            <div className="pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <SafeIcon name="TrendingUp" size={18} className="text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">
                  Popular Searches
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
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

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-0 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
              <div 
                className="sticky"
                style={{
                  top: '24px',
                  height: 'calc(85vh - 64px - 24px - 100px - 24px - 60px)',
                  maxHeight: 'calc(85vh - 64px - 24px - 100px - 24px - 60px)',
                  marginBottom: '24px'
                }}
              >
                <Card className="h-full flex flex-col overflow-hidden shadow-lg border-2">
                  <div className="flex-shrink-0 p-6 pb-0 bg-gradient-to-b from-card to-card/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <SafeIcon name="Filter" size={18} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-xl text-foreground">Filters</h3>
                      </div>
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="text-xs h-auto px-2 py-1 text-primary hover:text-primary hover:bg-primary/10 transition-colors rounded-md"
                          aria-label={`Clear all ${activeFilterCount} active filters`}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>
                    {activeFilterCount > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-semibold mb-4 border border-primary/20">
                        <SafeIcon name="Filter" size={14} />
                        {activeFilterCount} active
                      </div>
                    )}
                    <div className="border-b border-border/60 mb-4"></div>
                  </div>
                  <div 
                    className="flex-1 overflow-y-auto overflow-x-hidden filter-sidebar-scroll px-6 pb-6 bg-card"
                    style={{
                      paddingRight: '4px'
                    }}
                  >
                    <FilterSidebar
                      filterOptions={filterOptions}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      activeFilterCount={activeFilterCount}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3 flex flex-col min-h-0 overflow-hidden">
              {/* Fixed Header Section */}
              <div className="flex-shrink-0">
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4">
                  <Button
                    variant="outline"
                    className="w-full justify-between h-12 border-2 shadow-sm hover:shadow-md transition-all"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  >
                    <span className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <SafeIcon name="Filter" size={18} className="text-primary" />
                      </div>
                      <span className="font-semibold">Filters</span>
                      {activeFilterCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </span>
                    <SafeIcon
                      name={mobileFilterOpen ? "ChevronUp" : "ChevronDown"}
                      size={20}
                      className="text-muted-foreground"
                    />
                  </Button>
                </div>

                {/* Mobile Filter Panel */}
                {mobileFilterOpen && (
                  <Card className="lg:hidden mb-6 p-5 border-2 shadow-lg">
                    <FilterSidebar
                      filterOptions={filterOptions}
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      activeFilterCount={activeFilterCount}
                      onClearFilters={handleClearFilters}
                    />
                  </Card>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground">Loading jobs...</p>
                      <p className="text-sm text-muted-foreground">Please wait while we find the best opportunities for you</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {searchError && !isLoading && (
                  <div className="py-16 text-center">
                    <div className="max-w-md mx-auto">
                      <SafeIcon
                        name="AlertCircle"
                        size={48}
                        className="mx-auto mb-4 text-destructive"
                      />
                      <p className="text-lg font-semibold mb-2">Failed to load jobs</p>
                      <p className="text-sm text-muted-foreground mb-6">
                        Please try again or refresh the page
                      </p>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Reload Page
                      </Button>
                    </div>
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
              </div>

              {/* Scrollable Job Listings */}
              {!isLoading && !searchError && (
                <div id="job-results" className="flex-1 overflow-y-auto min-h-0 scrollbar-thin">
                  {filteredJobs.length > 0 ? (
                    <>
                      <JobListingGrid jobs={filteredJobs} viewMode={viewMode} />
                      {/* Show loading indicator while fetching in background */}
                      {isSearching && !isLoading && (
                        <div className="flex items-center justify-center py-6 mt-4 border-t">
                          <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                          <span className="text-sm text-muted-foreground">
                            Updating results...
                          </span>
                        </div>
                      )}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-8 pt-6 border-t">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) {
                                      setPage(page - 1);
                                    }
                                  }}
                                  className={
                                    page === 1
                                      ? "pointer-events-none opacity-50"
                                      : "cursor-pointer"
                                  }
                                />
                              </PaginationItem>
                              
                              {getPageNumbers().map((pageNum, index) => (
                                <PaginationItem key={index}>
                                  {pageNum === "ellipsis" ? (
                                    <PaginationEllipsis />
                                  ) : (
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setPage(pageNum);
                                      }}
                                      isActive={pageNum === page}
                                      className="cursor-pointer"
                                    >
                                      {pageNum}
                                    </PaginationLink>
                                  )}
                                </PaginationItem>
                              ))}
                              
                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) {
                                      setPage(page + 1);
                                    }
                                  }}
                                  className={
                                    page === totalPages
                                      ? "pointer-events-none opacity-50"
                                      : "cursor-pointer"
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                          
                          {/* Page Info */}
                          <div className="text-center mt-4 text-sm text-muted-foreground">
                            Showing {((page - 1) * limit) + 1} to{" "}
                            {Math.min(page * limit, searchTotal)} of{" "}
                            {searchTotal} jobs
                          </div>
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
