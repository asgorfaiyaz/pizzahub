import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <Card className="items-center gap-4 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted">
          <SearchXIcon className="size-7 text-muted-foreground" />
        </span>

        <div>
          <p className="text-sm font-semibold text-primary">404</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We couldn&apos;t find the page you&apos;re looking for. It may have
            moved, or the link might be outdated.
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link href="/" className={buttonVariants()}>
            Back to home
          </Link>
          <Link
            href="/browse-menu"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse menu
          </Link>
        </div>
      </Card>
    </main>
  );
}
