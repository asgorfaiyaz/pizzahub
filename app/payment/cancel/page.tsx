import Link from "next/link";
import { X } from "lucide-react";

import { UpgradeButton } from "@/components/subscription/upgrade-button";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CancelPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="items-center gap-4 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted">
          <X className="size-7 text-muted-foreground" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Upgrade cancelled
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            You have not been charged. You can upgrade to Premium whenever
            you&apos;re ready.
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <UpgradeButton size="sm" />
          <Link
            href="/dashboard/vendor"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Return to dashboard
          </Link>
        </div>
      </Card>
    </main>
  );
}
