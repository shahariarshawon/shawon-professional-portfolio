"use client";

import React from "react";
import { Search, Plus, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type SearchFilterBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter?: "ALL" | "ENABLED" | "DISABLED";
  onStatusFilterChange?: (status: "ALL" | "ENABLED" | "DISABLED") => void;
  sortBy?: string;
  onSortByChange?: (sort: string) => void;
  sortOptions?: { label: string; value: string }[];
  onAddNew?: () => void;
  addNewLabel?: string;
  totalCount: number;
  filteredCount: number;
  placeholder?: string;
};

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  statusFilter = "ALL",
  onStatusFilterChange,
  sortBy = "order",
  onSortByChange,
  sortOptions = [
    { label: "Default Order", value: "order" },
    { label: "Newest First", value: "newest" },
    { label: "Name / Title", value: "name" }
  ],
  onAddNew,
  addNewLabel = "Add New",
  totalCount,
  filteredCount,
  placeholder = "Search items..."
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-2xl border border-site">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-normal"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-site bg-(--color-background)/60 pl-10 pr-9 py-2 text-sm text-highlight placeholder:text-normal focus:border-(--color-accent) focus:outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-normal hover:text-highlight"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        {onStatusFilterChange && (
          <div className="flex items-center rounded-xl border border-site bg-(--color-background)/40 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => onStatusFilterChange("ALL")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === "ALL"
                  ? "bg-(--color-accent) text-white"
                  : "text-normal hover:text-highlight"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("ENABLED")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === "ENABLED"
                  ? "bg-(--color-accent) text-white"
                  : "text-normal hover:text-highlight"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => onStatusFilterChange("DISABLED")}
              className={`rounded-lg px-2.5 py-1.5 transition ${
                statusFilter === "DISABLED"
                  ? "bg-(--color-accent) text-white"
                  : "text-normal hover:text-highlight"
              }`}
            >
              Disabled
            </button>
          </div>
        )}

        {/* Sort Dropdown */}
        {onSortByChange && sortOptions.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown size={14} className="text-normal" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="rounded-xl border border-site bg-(--color-background)/60 px-3 py-2 text-xs text-highlight focus:border-(--color-accent) focus:outline-none transition cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="text-xs text-normal ml-auto md:ml-0">
          Showing {filteredCount} of {totalCount}
        </span>
      </div>

      {onAddNew && (
        <Button
          type="button"
          onClick={onAddNew}
          className="shrink-0 flex items-center gap-2 bg-(--color-accent) hover:opacity-90 text-white rounded-xl px-4 py-2 text-sm font-semibold transition"
        >
          <Plus size={16} />
          {addNewLabel}
        </Button>
      )}
    </div>
  );
}
