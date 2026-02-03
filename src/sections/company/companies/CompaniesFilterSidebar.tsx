import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import SafeIcon from "@/components/common/safe-icon";

interface FilterState {
  industry: string[];
}

interface CompaniesFilterSidebarProps {
  filterOptions: {
    industries: string[];
  };
  filters: FilterState;
  onFilterChange: (filterType: keyof FilterState, value: string | string[]) => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

export default function CompaniesFilterSidebar({
  filterOptions,
  filters,
  onFilterChange,
  activeFilterCount,
  onClearFilters,
}: CompaniesFilterSidebarProps) {
  const handleIndustryToggle = (industry: string) => {
    const newIndustries = filters.industry.includes(industry)
      ? filters.industry.filter((i) => i !== industry)
      : [...filters.industry, industry];
    onFilterChange("industry", newIndustries);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg" id="filters-heading">
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs h-auto p-0 text-primary hover:text-primary/80 transition-colors"
            aria-label={`Clear all ${activeFilterCount} active filters`}
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Badge */}
      {activeFilterCount > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <SafeIcon name="Filter" size={14} aria-hidden="true" />
          {activeFilterCount} active
        </div>
      )}

      <Separator />

      {/* Industry Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Industry</h4>
        {filterOptions.industries.map((industry) => (
          <div key={industry} className="flex items-center space-x-2">
            <Checkbox
              id={`industry-${industry}`}
              checked={filters.industry.includes(industry)}
              onCheckedChange={() => handleIndustryToggle(industry)}
            />
            <Label
              htmlFor={`industry-${industry}`}
              className="font-normal cursor-pointer text-sm"
            >
              {industry}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}







