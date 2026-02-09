
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SafeIcon from "@/components/common/safe-icon";

interface FilterState {
  location: string[]
  industry: string[]
  experienceLevel: string[]
  jobType: string[]
  salaryMin: number | null
  salaryMax: number | null
}

interface FilterSidebarProps {
  filterOptions: {
    locations: string[]
    industries: string[]
    experienceLevel: string[]
    jobType: string[]
  }
  filters: FilterState
  onFilterChange: (filterType: keyof FilterState, value: string | string[] | number | null) => void
  activeFilterCount: number
  onClearFilters: () => void
}

export default function FilterSidebar({
  filterOptions,
  filters,
  onFilterChange,
  activeFilterCount,
  onClearFilters,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter((l) => l !== location)
      : [...filters.location, location];
    onFilterChange("location", newLocations);
  };

  const handleJobTypeToggle = (type: string) => {
    const newTypes = filters.jobType.includes(type)
      ? filters.jobType.filter((t) => t !== type)
      : [...filters.jobType, type];
    onFilterChange("jobType", newTypes);
  };

  const handleIndustryToggle = (industry: string) => {
    const newIndustries = filters.industry.includes(industry)
      ? filters.industry.filter((i) => i !== industry)
      : [...filters.industry, industry];
    onFilterChange("industry", newIndustries);
  };

  const handleExperienceToggle = (level: string) => {
    const newLevels = filters.experienceLevel.includes(level)
      ? filters.experienceLevel.filter((l) => l !== level)
      : [...filters.experienceLevel, level];
    onFilterChange("experienceLevel", newLevels);
  };

  return (
    <div className="space-y-4">
      {/* All Filters in One Accordion */}
      <Accordion 
        type="multiple" 
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="w-full"
        aria-labelledby="filters-heading"
      >
        {/* Location Filter */}
        <AccordionItem value="location" className="border-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Location</span>
            {filters.location.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {filters.location.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            {filterOptions.locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.location.includes(location)}
                  onCheckedChange={() => handleLocationToggle(location)}
                />
                <Label htmlFor={`location-${location}`} className="font-normal cursor-pointer">
                  {location}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Job Type Filter */}
        <AccordionItem value="jobType" className="border-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Job Type</span>
            {filters.jobType.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {filters.jobType.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            {filterOptions.jobType.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`jobtype-${type}`}
                  checked={filters.jobType.includes(type)}
                  onCheckedChange={() => handleJobTypeToggle(type)}
                />
                <Label htmlFor={`jobtype-${type}`} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Industry Filter */}
        <AccordionItem value="industry" className="border-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Industry</span>
            {filters.industry.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {filters.industry.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            {filterOptions.industries.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${industry}`}
                  checked={filters.industry.includes(industry)}
                  onCheckedChange={() => handleIndustryToggle(industry)}
                />
                <Label htmlFor={`industry-${industry}`} className="font-normal cursor-pointer">
                  {industry}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Experience Level Filter */}
        <AccordionItem value="experienceLevel" className="border-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <span className="font-medium">Experience Level</span>
            {filters.experienceLevel.length > 0 && (
              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {filters.experienceLevel.length}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            {filterOptions.experienceLevel.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`experience-${level}`}
                  checked={filters.experienceLevel.includes(level)}
                  onCheckedChange={() => handleExperienceToggle(level)}
                />
                <Label htmlFor={`experience-${level}`} className="font-normal cursor-pointer">
                  {level}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
