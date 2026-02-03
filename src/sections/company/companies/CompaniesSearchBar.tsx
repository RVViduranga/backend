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
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <SafeIcon
          name="Search"
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder="Search companies by name or industry..."
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 h-12 text-base transition-all focus-visible:ring-2"
          aria-label="Search companies by name or industry"
        />
      </div>
      <Button
        size="lg"
        className="px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
        onClick={onSearch}
        aria-label="Search companies"
      >
        <SafeIcon name="Search" size={20} className="mr-2" aria-hidden="true" />
        Search
      </Button>
    </div>
  );
}








