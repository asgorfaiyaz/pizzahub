import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <Card className="items-center gap-4 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlertIcon className="size-7 text-destructive" />
        </span>

        <div>
          <Badge variant="secondary">403</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Access denied
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            You don&apos;t have permission to view this page or perform this
            action. If you think this is a mistake, contact support.
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link href="/dashboard" className={buttonVariants()}>
            Go to dashboard
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </Card>
    </main>
  );
}
