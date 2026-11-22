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

const BASE_PATH = "/dashboard/admin/transactions";

type TransactionsPaginationProps = {
  page: number;
  totalPages: number;
};

function buildHref(page: number) {
  return page > 1 ? `${BASE_PATH}?page=${page}` : BASE_PATH;
}

function blockNavigation(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

export function TransactionsPagination({
  page,
  totalPages,
}: TransactionsPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={page <= 1 ? blockNavigation : undefined}
          />
        </PaginationItem>

        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href={buildHref(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildHref(page + 1)}
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
