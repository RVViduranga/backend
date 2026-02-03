import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SafeIcon from "@/components/common/safe-icon";

interface CompaniesResultsHeaderProps {
  resultCount: number;
  sortBy: "name" | "jobs";
  onSortChange: (sort: "name" | "jobs") => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export default function CompaniesResultsHeader({
  resultCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: CompaniesResultsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
      {/* Results Count */}
      <div>
        <p className="text-lg font-semibold">
          {resultCount} {resultCount === 1 ? "company" : "companies"} found
        </p>
        <p className="text-sm text-muted-foreground">
          {resultCount > 0
            ? "Explore opportunities with these companies"
            : "Try adjusting your search criteria"}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value: "name" | "jobs") => onSortChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SafeIcon name="ArrowUpDown" size={16} className="mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="jobs">Most Jobs</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div
          className="flex items-center gap-1 border rounded-lg p-1 bg-muted"
          role="tablist"
          aria-label="View mode"
        >
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="h-8 w-8 p-0 transition-all"
            title="Grid view"
            aria-label="Switch to grid view"
            aria-selected={viewMode === "grid"}
            role="tab"
          >
            <SafeIcon name="Grid" size={16} aria-hidden="true" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="h-8 w-8 p-0 transition-all"
            title="List view"
            aria-label="Switch to list view"
            aria-selected={viewMode === "list"}
            role="tab"
          >
            <SafeIcon name="List" size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}







