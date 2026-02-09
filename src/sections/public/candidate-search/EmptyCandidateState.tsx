import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

interface EmptyCandidateStateProps {
  searchQuery: string;
  location: string;
  onResetSearch: () => void;
}

export default function EmptyCandidateState({
  searchQuery,
  location,
  onResetSearch,
}: EmptyCandidateStateProps) {
  const hasSearch = searchQuery || location;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-500">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <SafeIcon
          name="UserSearch"
          size={48}
          className="text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <h3 className="text-2xl font-semibold mb-2">No candidates found</h3>

      <p className="text-muted-foreground text-center max-w-md mb-6">
        {hasSearch
          ? `We couldn't find any candidates matching your search criteria.`
          : "Start searching to find talented professionals"}
      </p>

      {hasSearch && (
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
      )}

      {hasSearch && (
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
              <span>Try using different names or keywords</span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon
                name="CheckCircle2"
                size={16}
                className="mt-0.5 flex-shrink-0 text-primary"
              />
              <span>Expand your location search</span>
            </li>
            <li className="flex items-start gap-2">
              <SafeIcon
                name="CheckCircle2"
                size={16}
                className="mt-0.5 flex-shrink-0 text-primary"
              />
              <span>Try searching by skills or job titles</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
