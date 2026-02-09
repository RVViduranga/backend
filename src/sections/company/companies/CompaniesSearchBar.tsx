import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/safe-icon";

interface CompaniesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

export default function CompaniesSearchBar({
  value,
  onChange,
  onSearch,
}: CompaniesSearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch();
      e.currentTarget.blur();
    }
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <SafeIcon
          name="Search"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search companies by name or industry..."
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          className="pl-11 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-0"
          aria-label="Search companies by name or industry"
        />
      </div>
      <Button
        size="lg"
        className="px-8 h-12 text-base font-medium"
        onClick={onSearch}
        aria-label="Search companies"
      >
        <SafeIcon name="Search" size={20} className="mr-2" aria-hidden="true" />
        Search
      </Button>
    </div>
  );
}








