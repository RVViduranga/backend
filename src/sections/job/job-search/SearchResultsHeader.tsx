
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SafeIcon from "@/components/common/safe-icon"

interface SearchResultsHeaderProps {
  resultCount: number
  sortBy: 'recent' | 'relevant'
  onSortChange: (sort: 'recent' | 'relevant') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function SearchResultsHeader({
  resultCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SearchResultsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-border/60">
      {/* Results Count */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SafeIcon name="Briefcase" size={20} className="text-primary" />
          <p className="text-xl font-bold text-foreground">
            {resultCount} {resultCount === 1 ? 'job' : 'jobs'} found
          </p>
        </div>
        <p className="text-sm text-muted-foreground ml-7">
          {resultCount > 0 ? 'Showing all matching positions' : 'Try adjusting your filters'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={(value: "recent" | "relevant") => onSortChange(value)}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SafeIcon name="ArrowUpDown" size={16} className="mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 border-2 rounded-lg p-1 bg-muted/30" role="tablist" aria-label="View mode">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="h-9 w-9 p-0 transition-all"
            title="Grid view"
            aria-label="Switch to grid view"
            aria-selected={viewMode === 'grid'}
            role="tab"
          >
            <SafeIcon name="Grid" size={18} aria-hidden="true" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="h-9 w-9 p-0 transition-all"
            title="List view"
            aria-label="Switch to list view"
            aria-selected={viewMode === 'list'}
            role="tab"
          >
            <SafeIcon name="List" size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
