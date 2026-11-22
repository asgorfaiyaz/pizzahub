import {
  BadgeCheck,
  Ban,
  Briefcase,
  CreditCard,
  Mail,
  UserRound,
} from "lucide-react";

import { ROLE_LABELS } from "@/lib/roles";
import type { ProfileUser } from "@/components/profile/types";
import { Reveal } from "@/components/home/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function DetailCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card className={className ?? "flex items-center gap-3 p-4"}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </Card>
  );
}

export function ProfileAccountDetails({ user }: { user: ProfileUser }) {
  const role = user.role || "customer";
  const isVendor = role === "vendor";

  return (
    <Reveal>
      <section aria-labelledby="account-details-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2
              id="account-details-heading"
              className="mt-1 text-2xl font-semibold tracking-tight"
            >
              Account details
            </h2>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <BadgeCheck className="size-3.5" />
            Verified
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <DetailCard icon={Mail} label="Email address" value={user.email} />
          <DetailCard
            icon={UserRound}
            label="Role"
            value={ROLE_LABELS[role as keyof typeof ROLE_LABELS] ?? role}
          />
          <DetailCard
            icon={Ban}
            label="Blocked"
            value={user.isBlocked ? "Yes" : "No"}
          />
          <DetailCard
            icon={CreditCard}
            label="Subscription plan"
            value={user.subscriptionPlan ?? "Not set"}
          />
          {isVendor && user.businessName ? (
            <DetailCard
              icon={Briefcase}
              label="Business"
              value={user.businessName}
              className="flex items-center gap-3 p-4 sm:col-span-2"
            />
          ) : null}
        </div>
      </section>
    </Reveal>
  );
}
