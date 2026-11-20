"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MENU_ITEM_CATEGORIES } from "@/lib/menu-items/types";

const ALL = "all";

type BrowseMenuFiltersProps = {
  locations: string[];
};

export function BrowseMenuFilters({ locations }: BrowseMenuFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const category = searchParams.get("category") ?? ALL;
  const location = searchParams.get("location") ?? ALL;

  const categoryOptions = [
    { value: ALL, label: "All categories" },
    ...MENU_ITEM_CATEGORIES.map((value) => ({ value, label: value })),
  ];

  const locationOptions = [
    { value: ALL, label: "All locations" },
    ...locations.map((value) => ({ value, label: value })),
  ];

  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "";

  const sortOptions = [
    { value: "", label: "Default order" },
    { value: "price-asc", label: "Price: low to high" },
    { value: "price-desc", label: "Price: high to low" },
  ];

  const activeSort =
    sortBy === "price"
      ? sortOrder === "desc"
        ? "price-desc"
        : "price-asc"
      : "";

  function updateFilter(key: "category" | "location", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL) params.delete(key);
    else params.set(key, value);

    // Any new filter starts from the first page.
    params.delete("page");

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "price-asc") {
      params.set("sortBy", "price");
      params.set("sortOrder", "asc");
    } else if (value === "price-desc") {
      params.set("sortBy", "price");
      params.set("sortOrder", "desc");
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    // Any new sort starts from the first page.
    params.delete("page");

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Select
        items={categoryOptions}
        value={category}
        onValueChange={(value) => updateFilter("category", value ?? ALL)}
      >
        <SelectTrigger aria-label="Filter by category" className="sm:w-56">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={locationOptions}
        value={location}
        onValueChange={(value) => updateFilter("location", value ?? ALL)}
      >
        <SelectTrigger aria-label="Filter by location" className="sm:w-56">
          <SelectValue placeholder="All locations" />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={sortOptions}
        value={activeSort}
        onValueChange={(value) => updateSort(value ?? "")}
      >
        <SelectTrigger aria-label="Sort by" className="sm:w-56">
          <SelectValue placeholder="Default order" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
