import Link from "next/link";
import { LockKeyholeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <Card className="items-center gap-4 py-14 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted">
          <LockKeyholeIcon className="size-7 text-muted-foreground" />
        </span>

        <div>
          <Badge variant="secondary">401</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Sign in required
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            You need to be signed in to view this page or perform this action.
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link href="/sign-in" className={buttonVariants()}>
            Sign in
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back to home
          </Link>
        </div>
      </Card>
    </main>
  );
}
