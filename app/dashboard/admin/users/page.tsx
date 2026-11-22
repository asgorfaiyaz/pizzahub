import { Suspense } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { SearchXIcon, UsersRoundIcon } from "lucide-react";

import { dashboardLinks } from "@/app/dashboard/lib/dashboard-links";
import { getUsers } from "@/lib/admin/queries";
import type { User } from "@/lib/admin/types";
import { ROLE_LABELS, type UserRole } from "@/lib/roles";
import { getServerSession } from "@/lib/server-session";
import { UserBlockButton } from "@/components/admin/user-block-button";
import { UserDetailsButton } from "@/components/admin/user-details-button";
import { UsersFilters } from "@/components/admin/users-filters";
import { UsersPagination } from "@/components/admin/users-pagination";
import { UsersSearch } from "@/components/admin/users-search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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

type AdminUsersSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
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

function roleVariant(role: string): "default" | "secondary" | "outline" {
  if (role === "admin") return "default";
  if (role === "vendor") return "secondary";
  return "outline";
}

function UsersSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full sm:w-48" />
      </div>

      <Card className="gap-0 overflow-hidden py-0">
        <div className="border-b bg-muted/50 px-4 py-3">
          <Skeleton className="h-3 w-24" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b p-4 last:border-0"
          >
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="size-7 rounded-lg" />
              <Skeleton className="size-7 rounded-lg" />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const Icon = hasFilters ? SearchXIcon : UsersRoundIcon;

  return (
    <Card className="mt-8 items-center gap-3 border-dashed bg-card/50 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </span>
      <div>
        <p className="font-medium">
          {hasFilters ? "No users match your filters" : "No users yet"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasFilters
            ? "Try a different name, email, or role."
            : "Users will show up here once they join PizzaHub."}
        </p>
      </div>
      {hasFilters ? (
        <Link
          href="/dashboard/admin/users"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Clear filters
        </Link>
      ) : null}
    </Card>
  );
}

function ErrorState() {
  return (
    <Card className="mt-8 items-center gap-2 py-12 text-center">
      <p className="font-medium">Unable to load users</p>
      <p className="text-sm text-muted-foreground">
        Please refresh the page and try again.
      </p>
    </Card>
  );
}

async function UsersContent({
  searchParams,
}: {
  searchParams: Promise<AdminUsersSearchParams>;
}) {
  const [params, session] = await Promise.all([
    searchParams,
    getServerSession(),
  ]);

  const currentUserId = session?.user.id;

  const search = (first(params.search) ?? "").trim();
  const role = first(params.role) ?? "";
  const requestedPage = Math.max(1, Number(first(params.page)) || 1);

  let users: User[];
  let pagination;

  try {
    const result = await getUsers({
      search,
      role,
      page: requestedPage,
      limit: PAGE_SIZE,
    });
    users = result.users;
    pagination = result.pagination;
  } catch (error) {
    unstable_rethrow(error);
    return <ErrorState />;
  }

  const hasFilters = Boolean(search || role);

  return (
    <div className="mt-8 flex flex-col gap-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <UsersSearch />
        <UsersFilters />
      </div>

      {users.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} of {pagination.total}{" "}
              {pagination.total === 1 ? "user" : "users"}
            </p>
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </p>
          </div>

          <Card className="gap-0 overflow-hidden py-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Phone
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.role)}>
                        {ROLE_LABELS[user.role as UserRole] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {user.phone || "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UserBlockButton
                          id={user._id}
                          name={user.name}
                          initialBlocked={Boolean(user.isBlocked)}
                          isSelf={user._id === currentUserId}
                        />
                        <UserDetailsButton id={user._id} name={user.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <UsersPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            searchParams={{
              search: search || undefined,
              role: role || undefined,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<AdminUsersSearchParams>;
}) {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {dashboardLinks.admin[1].label}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
        {dashboardLinks.admin[1].description}
      </p>

      <Suspense fallback={<UsersSkeleton />}>
        <UsersContent searchParams={searchParams} />
      </Suspense>
    </section>
  );
}
