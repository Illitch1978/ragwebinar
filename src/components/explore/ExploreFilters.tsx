import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  source: string;
  sourceType: string;
  year: string;
  audienceType: string;
  market: string;
}

interface ExploreFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  matchingCount: number;
}

// Mock filter options - in real app, these would come from the data
const sourceOptions = [
  { value: "workshop-transcript", label: "Workshop Transcript" },
  { value: "interview", label: "Interview" },
  { value: "survey-results", label: "Survey Results" },
  { value: "financial-report", label: "Financial Report" },
  { value: "competitive-analysis", label: "Competitive Analysis" },
];

const sourceTypeOptions = [
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "Document" },
  { value: "link", label: "Link" },
  { value: "data", label: "Dataset" },
];

const yearOptions = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
];

const audienceTypeOptions = [
  { value: "researcher", label: "Researcher" },
  { value: "executive", label: "Executive" },
  { value: "analyst", label: "Analyst" },
  { value: "customer", label: "Customer" },
];

const marketOptions = [
  { value: "north-america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "apac", label: "APAC" },
  { value: "global", label: "Global" },
];

const ExploreFilters = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  matchingCount,
}: ExploreFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="w-4 h-4" />
          Filters
        </div>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={onClearFilters}
            >
              Clear all
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onApplyFilters}
          >
            <Filter className="w-3.5 h-3.5" />
            Apply Filters
          </Button>
          <span className="text-sm text-muted-foreground">
            {matchingCount} matching
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Source */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Source</label>
          <Select
            value={filters.source}
            onValueChange={(value) => onFilterChange("source", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Source Type */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Source type</label>
          <Select
            value={filters.sourceType}
            onValueChange={(value) => onFilterChange("sourceType", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {sourceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Year</label>
          <Select
            value={filters.year}
            onValueChange={(value) => onFilterChange("year", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audience Type */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Audience type</label>
          <Select
            value={filters.audienceType}
            onValueChange={(value) => onFilterChange("audienceType", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {audienceTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Market */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Market</label>
          <Select
            value={filters.market}
            onValueChange={(value) => onFilterChange("market", value)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {marketOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ExploreFilters;
