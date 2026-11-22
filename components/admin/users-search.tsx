"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export function UsersSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function handleChange(nextValue: string) {
    setValue(nextValue);

    const params = new URLSearchParams(searchParams.toString());
    const search = nextValue.trim();

    if (search) params.set("search", search);
    else params.delete("search");

    params.delete("page");

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Search users by name or email..."
        aria-label="Search users by name or email"
        className="pl-8"
      />
    </div>
  );
}
