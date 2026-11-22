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

const statusOptions = [
  { value: ALL, label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "inactive", label: "Inactive" },
];

const categoryOptions = [
  { value: ALL, label: "All categories" },
  ...MENU_ITEM_CATEGORIES.map((value) => ({ value, label: value })),
];

export function AdminMenuItemsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const status = searchParams.get("status") ?? ALL;
  const category = searchParams.get("category") ?? ALL;

  function updateFilter(key: "status" | "category", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL) params.delete(key);
    else params.set(key, value);

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
        items={statusOptions}
        value={status}
        onValueChange={(value) => updateFilter("status", value ?? ALL)}
      >
        <SelectTrigger aria-label="Filter by status" className="sm:w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
    </div>
  );
}
