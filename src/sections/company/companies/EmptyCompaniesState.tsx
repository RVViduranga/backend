import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

interface EmptyCompaniesStateProps {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onResetSearch: () => void;
}

export default function EmptyCompaniesState({
  searchQuery,
  hasFilters,
  onClearFilters,
  onResetSearch,
}: EmptyCompaniesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <SafeIcon
          name="Building2"
          size={48}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-2xl font-semibold mb-2">No companies found</h3>

      <p className="text-muted-foreground text-center max-w-md mb-6">
        {searchQuery && hasFilters
          ? `We couldn't find any companies matching "${searchQuery}" with your selected filters.`
          : searchQuery
          ? `We couldn't find any companies matching "${searchQuery}".`
          : "No companies match your current filters. Try adjusting your search criteria."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {hasFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="transition-all hover:scale-105 active:scale-95"
            aria-label="Clear all active filters"
          >
            <SafeIcon
              name="RotateCcw"
              size={16}
              className="mr-2"
              aria-hidden="true"
            />
            Clear Filters
          </Button>
        )}
        <Button
          onClick={onResetSearch}
          className="transition-all hover:scale-105 active:scale-95"
          aria-label="Reset search and start new search"
        >
          <SafeIcon
            name="RefreshCw"
            size={16}
            className="mr-2"
            aria-hidden="true"
          />
          Try New Search
        </Button>
      </div>

      <div className="mt-12 pt-8 border-t w-full max-w-md">
        <p className="text-sm text-muted-foreground text-center mb-4">
          💡 Tips for better search results:
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <SafeIcon
              name="CheckCircle2"
              size={16}
              className="mt-0.5 flex-shrink-0 text-primary"
            />
            <span>Try using different company names or keywords</span>
          </li>
          <li className="flex items-start gap-2">
            <SafeIcon
              name="CheckCircle2"
              size={16}
              className="mt-0.5 flex-shrink-0 text-primary"
            />
            <span>Try different industry filters</span>
          </li>
          <li className="flex items-start gap-2">
            <SafeIcon
              name="CheckCircle2"
              size={16}
              className="mt-0.5 flex-shrink-0 text-primary"
            />
            <span>Clear all filters to see all companies</span>
          </li>
        </ul>
      </div>
    </div>
  );
}








