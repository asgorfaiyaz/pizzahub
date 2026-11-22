"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCwIcon, TriangleAlertIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <Card className="items-center gap-4 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlertIcon className="size-7 text-destructive" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {error.message ||
              "We couldn't load this page. Please try again in a moment."}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={retry}>
            <RefreshCwIcon />
            Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </Card>
    </main>
  );
}
