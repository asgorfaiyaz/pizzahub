import { Suspense } from "react";
import { unstable_rethrow } from "next/navigation";
import { SearchXIcon } from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getTransactions } from "@/lib/transactions/queries";
import type { Transaction } from "@/lib/transactions/types";
import { TransactionsPagination } from "@/components/admin/transactions-pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;

type TransactionsSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
}

function TransactionsSkeleton() {
  return (
    <Card className="mt-8 gap-0 overflow-hidden py-0">
      <div className="border-b bg-muted/50 px-4 py-3">
        <Skeleton className="h-3 w-28" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b p-4 last:border-0"
        >
          <Skeleton className="h-4 w-28 font-mono" />
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="mt-8 items-center gap-3 border-dashed bg-card/50 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <SearchXIcon className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="font-medium">No transactions yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Payments from vendors will show up here.
        </p>
      </div>
    </Card>
  );
}

function ErrorState() {
  return (
    <Card className="mt-8 items-center gap-2 py-12 text-center">
      <p className="font-medium">Unable to load transactions</p>
      <p className="text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const vendor = transaction.vendor;

  return (
    <TableRow>
      <TableCell>
        <span
          className="font-mono text-xs text-muted-foreground"
          title={transaction.transactionId}
        >
          {transaction.transactionId.slice(0, 12)}…
        </span>
      </TableCell>
      <TableCell>
        {vendor ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initials(vendor.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {vendor.businessName || vendor.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {vendor.email}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Unknown vendor</span>
        )}
      </TableCell>
      <TableCell className="font-semibold tabular-nums">
        {formatAmount(transaction.amount, transaction.currency)}
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant(transaction.paymentStatus)} className="capitalize">
          {transaction.paymentStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={transaction.subscriptionPlan ? "default" : "outline"}>
          {transaction.subscriptionPlan ? "Pro" : "Normal"}
        </Badge>
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
        {transaction.paymentMethod.join(", ") || "—"}
      </TableCell>
      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
        {formatDate(transaction.transactionDate || transaction.createdAt)}
      </TableCell>
    </TableRow>
  );
}

async function TransactionsContent({
  searchParams,
}: {
  searchParams: Promise<TransactionsSearchParams>;
}) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number(first(params.page)) || 1);

  let transactions: Transaction[];
  let pagination;

  try {
    const result = await getTransactions({
      page: requestedPage,
      limit: PAGE_SIZE,
    });
    transactions = result.transactions;
    pagination = result.pagination;
  } catch (error) {
    unstable_rethrow(error);
    return <ErrorState />;
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {transactions.length} of {pagination.total}{" "}
          {pagination.total === 1 ? "transaction" : "transactions"}
        </p>
        <p className="text-sm text-muted-foreground">
          Page {pagination.page} of {pagination.totalPages}
        </p>
      </div>

      {transactions.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Card className="gap-0 overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Transaction</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Method
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TransactionRow key={transaction._id} transaction={transaction} />
                ))}
              </TableBody>
            </Table>
          </Card>

          <TransactionsPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        </>
      )}
    </div>
  );
}

export default function AdminTransactionsPage({
  searchParams,
}: {
  searchParams: Promise<TransactionsSearchParams>;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {dashboardLinks.admin[3].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.admin[3].description}
      </p>

      <Suspense fallback={<TransactionsSkeleton />}>
        <TransactionsContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
