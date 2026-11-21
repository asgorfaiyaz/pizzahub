import { Suspense } from "react";
import Link from "next/link";
import { Check, Clock3 } from "lucide-react";

import {
  getPaymentConfirmation,
  getVendorSubscription,
} from "@/lib/subscriptions/queries";
import type {
  PaymentConfirmation,
  VendorSubscriptionStatus,
} from "@/lib/subscriptions/types";
import { RefreshStatusButton } from "@/components/subscription/refresh-status-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const premiumFeatures = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
];

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
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

function SuccessSkeleton() {
  return (
    <div className="grid gap-4">
      <Card className="items-center gap-4 py-12">
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="h-8 w-40 rounded-lg" />
      </Card>
      <Card className="gap-3 p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    </div>
  );
}

function ErrorState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="items-center gap-3 py-12 text-center">
      <p className="font-medium">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      <Link
        href="/dashboard/vendor/subscription"
        className={buttonVariants({ size: "sm" })}
      >
        Go to subscription
      </Link>
    </Card>
  );
}

function TransactionDetails({
  confirmation,
}: {
  confirmation: PaymentConfirmation;
}) {
  const rows = [
    { label: "Transaction", value: confirmation.transactionId, mono: true },
    {
      label: "Amount",
      value: formatAmount(confirmation.amount, confirmation.currency),
      mono: false,
    },
    { label: "Status", value: confirmation.status, mono: false },
    { label: "Plan", value: confirmation.plan, mono: false },
    { label: "Date", value: formatDate(confirmation.createdAt), mono: false },
  ];

  return (
    <div className="w-full rounded-xl border bg-muted/30 p-4 text-left">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Payment details
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="text-xs font-medium text-muted-foreground">
              {row.label}
            </dt>
            <dd
              className={`mt-1 truncate text-sm font-medium capitalize ${
                row.mono ? "font-mono text-xs" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function PendingState({
  confirmation,
}: {
  confirmation: PaymentConfirmation | null;
}) {
  return (
    <Card className="items-center gap-3 py-12 text-center" role="status">
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Clock3 className="size-7 text-muted-foreground" />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">
        Payment received
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We&apos;re confirming your subscription with Stripe. This usually takes
        a few seconds, so refresh the status in a moment.
      </p>
      {confirmation ? (
        <p className="text-sm font-medium">
          {formatAmount(confirmation.amount, confirmation.currency)} ·{" "}
          <span className="capitalize">{confirmation.status}</span>
        </p>
      ) : null}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        <RefreshStatusButton />
        <Link
          href="/dashboard/vendor/subscription"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          View subscription
        </Link>
      </div>
    </Card>
  );
}

function PremiumState({
  status,
  confirmation,
}: {
  status: VendorSubscriptionStatus | null;
  confirmation: PaymentConfirmation | null;
}) {
  return (
    <div className="grid gap-4">
      <Card className="items-center gap-4 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Check className="size-7 text-primary" />
        </span>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Payment successful
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;re now a Premium vendor. Your subscription is active.
          </p>
        </div>

        <Badge>Premium</Badge>

        <ul className="mt-1 grid gap-2 text-left text-sm">
          {premiumFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {status ? (
          <p className="text-xs text-muted-foreground">
            {status.activeItemCount} active{" "}
            {status.activeItemCount === 1 ? "item" : "items"} on your menu
          </p>
        ) : null}

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({ size: "sm" })}
          >
            Go to my menu items
          </Link>
          <Link
            href="/dashboard/vendor/subscription"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View subscription
          </Link>
        </div>
      </Card>

      {confirmation ? <TransactionDetails confirmation={confirmation} /> : null}
    </div>
  );
}

type SuccessSearchParams = {
  session_id?: string | string[];
};

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? params.session_id[0]
    : params.session_id;

  let confirmation: PaymentConfirmation | null = null;

  if (sessionId) {
    try {
      confirmation = await getPaymentConfirmation(sessionId);
    } catch {
      return (
        <ErrorState
          title="Unable to confirm your payment"
          description="We couldn't verify this checkout session. If you were charged, check your subscription page or contact support."
        />
      );
    }
  }

  let status: VendorSubscriptionStatus | null = null;

  try {
    status = await getVendorSubscription();
  } catch {
    if (!confirmation) {
      return (
        <ErrorState
          title="Unable to confirm your subscription"
          description="If your payment went through, your plan will update shortly. You can check the status from your subscription page."
        />
      );
    }
  }

  const isPremium =
    status?.isPremium || confirmation?.status === "completed" || false;

  if (!isPremium) {
    return <PendingState confirmation={confirmation} />;
  }

  return <PremiumState status={status} confirmation={confirmation} />;
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SuccessSearchParams>;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
