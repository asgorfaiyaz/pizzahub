"use client";

import type { MouseEvent } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BASE_PATH = "/dashboard/admin/users";

type UsersPaginationProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function buildHref(
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }

  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();

  return queryString ? `${BASE_PATH}?${queryString}` : BASE_PATH;
}

function blockNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function UsersPagination({
  page,
  totalPages,
  searchParams,
}: UsersPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(searchParams, page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={page <= 1 ? blockNavigation : undefined}
          />
        </PaginationItem>

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={buildHref(searchParams, pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildHref(searchParams, page + 1)}
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
            onClick={page >= totalPages ? blockNavigation : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
