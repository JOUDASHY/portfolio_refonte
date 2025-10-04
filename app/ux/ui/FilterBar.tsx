"use client";

import SearchBar from "./SearchBar";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;
  statusOptions?: Array<{ value: string; label: string }>;
}

export default function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  statusOptions
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <SearchBar
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
      />
      {statusFilter && onStatusFilterChange && statusOptions && (
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="appearance-none rounded-lg border border-white/30 bg-white/20 px-3 py-2 pr-8 text-sm text-black ring-1 ring-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 min-w-[150px] hover:bg-white/30 transition-colors cursor-pointer"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-black">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <i className="fas fa-chevron-down text-foreground/60 text-xs"></i>
          </div>
        </div>
      )}
    </div>
  );
}
