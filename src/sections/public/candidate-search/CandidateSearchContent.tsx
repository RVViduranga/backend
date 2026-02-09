import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/safe-icon";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import userService from "@/services/user";
import { logger } from "@/lib/logger";
import EmptyCandidateState from "./EmptyCandidateState";

interface CandidateSearchParams {
  query?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export default function CandidateSearchContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const searchParams: CandidateSearchParams = useMemo(
    () => ({
      query: searchQuery || undefined,
      location: location || undefined,
      page,
      limit,
    }),
    [searchQuery, location, page, limit]
  );

  const {
    data: searchResults,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["candidates", "search", searchParams],
    queryFn: () => userService.searchCandidates(searchParams),
    enabled: true,
  });

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
  };

  const handleClear = () => {
    setSearchQuery("");
    setLocation("");
    setPage(1);
  };

  const candidates = searchResults?.profiles || [];
  const total = searchResults?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Hero Section */}
      <div className="border-b bg-card">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              Find Candidates
            </h1>
            <p className="text-base text-muted-foreground">
              Search for talented professionals by name, skills, or location
            </p>
          </div>

          {/* Search Bar */}
          <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium text-foreground">
                    Search by name or skills
                  </label>
                  <div className="relative">
                    <SafeIcon
                      name="Search"
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <Input
                      id="search"
                      type="text"
                      placeholder="e.g., John Doe, Software Engineer, React Developer"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-11 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium text-foreground">
                    Location
                  </label>
                  <div className="relative">
                    <SafeIcon
                      name="MapPin"
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., Colombo, New York, Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      className="pl-11 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSearch} className="h-12 px-8 text-base font-medium">
                  <SafeIcon name="Search" size={20} className="mr-2" />
                  Search
                </Button>
                {(searchQuery || location) && (
                  <Button variant="outline" onClick={handleClear} className="h-12">
                    Clear
                  </Button>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Loading State */}
          {(isLoading || isFetching) && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading candidates...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && !isFetching && (
            <div className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <SafeIcon
                  name="AlertCircle"
                  size={48}
                  className="mx-auto mb-4 text-destructive"
                />
                <p className="text-lg font-semibold mb-2">Failed to load candidates</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Please try again or refresh the page
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reload Page
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isFetching && !error && candidates.length === 0 && (
            <EmptyCandidateState
              searchQuery={searchQuery}
              location={location}
              onResetSearch={handleClear}
            />
          )}

          {/* Results */}
          {!isLoading && !isFetching && !error && candidates.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-6 pb-4 border-b">
                <p className="text-lg font-semibold text-foreground">
                  {total} {total === 1 ? "candidate" : "candidates"} found
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Showing matching professionals
                </p>
              </div>

              {/* Candidate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/20"
                  >
                    <Link to={`/users/${candidate.userId}`}>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-background">
                            {candidate.avatarUrl ? (
                              <img
                                src={candidate.avatarUrl}
                                alt={candidate.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <SafeIcon
                                name="User"
                                size={32}
                                className="text-muted-foreground"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-1 truncate">
                              {candidate.fullName}
                            </CardTitle>
                            {candidate.headline && (
                              <CardDescription className="line-clamp-2">
                                {candidate.headline}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {candidate.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <SafeIcon name="MapPin" size={16} />
                            <span className="truncate">{candidate.location}</span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/users/${candidate.userId}`;
                          }}
                        >
                          View Profile
                          <SafeIcon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <SafeIcon name="ChevronLeft" size={16} className="mr-2" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2 px-4">
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <SafeIcon name="ChevronRight" size={16} className="ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
