import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
      e.currentTarget.blur(); // Remove focus after search
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <SafeIcon
          name="Search"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Job title, keywords, or company name..."
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          className="pl-11 h-14 text-base border-2 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm transition-all"
          aria-label="Search jobs by title, keywords, or company name"
        />
      </div>
      <Button
        size="lg"
        className="px-10 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        onClick={onSearch}
        aria-label="Search jobs"
      >
        <SafeIcon name="Search" size={20} className="mr-2" aria-hidden="true" />
        Search
      </Button>
    </div>
  );
}
