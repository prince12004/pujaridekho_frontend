"use client";

import { Button } from "@/components/ui/button";

// Page size for lists the API returns in full; those are paginated in the browser.
export const CLIENT_PAGE_SIZE = 20;

// Large enough that dropdowns (pandits, poojas, festivals...) list every record
// instead of stopping at the API's default page size.
export const ALL_RECORDS_LIMIT = 1000;

export function paginateClient<T>(items: T[] | undefined, page: number) {
  const list = items ?? [];
  return {
    pageItems: list.slice((page - 1) * CLIENT_PAGE_SIZE, page * CLIENT_PAGE_SIZE),
    total: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / CLIENT_PAGE_SIZE)),
  };
}

export function AdminPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;
  const lastPage = Math.max(1, totalPages);

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page {page} of {lastPage} ({total} total)
      </span>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
