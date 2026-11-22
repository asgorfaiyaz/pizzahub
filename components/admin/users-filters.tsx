"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABELS, USER_ROLES } from "@/lib/roles";

const ALL = "all";

const roleOptions = [
  { value: ALL, label: "All roles" },
  ...USER_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
];

export function UsersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const role = searchParams.get("role") ?? ALL;

  function updateRole(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === ALL) params.delete("role");
    else params.set("role", value);

    params.delete("page");

    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  return (
    <Select
      items={roleOptions}
      value={role}
      onValueChange={(value) => updateRole(value ?? ALL)}
    >
      <SelectTrigger
        aria-label="Filter by role"
        className="w-full gap-2 sm:w-48"
      >
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        <SelectValue placeholder="All roles" />
      </SelectTrigger>
      <SelectContent>
        {roleOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
