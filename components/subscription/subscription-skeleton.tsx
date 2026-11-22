import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionSkeleton() {
  return (
    <div className="mt-8 flex flex-col gap-6">
      <Card className="gap-0 overflow-hidden py-0">
        <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-64 max-w-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>
        <div className="grid gap-3 border-t px-6 py-6 sm:grid-cols-3 sm:px-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <Skeleton className="h-4 w-64 max-w-full" />
          <Skeleton className="mt-3 h-2 w-full rounded-full" />
        </div>
      </Card>

      <div className="space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="gap-5 p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="size-11 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-56 max-w-full" />
                <Skeleton className="h-4 w-48 max-w-full" />
                <Skeleton className="h-4 w-44 max-w-full" />
              </div>
              <Skeleton className="h-8 w-40 rounded-lg" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
