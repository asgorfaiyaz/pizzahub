import { Crown, Fingerprint, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProfileUser } from "@/components/profile/types";
import { Reveal } from "@/components/home/reveal";
import { Card } from "@/components/ui/card";

type TileTone = "default" | "success" | "danger" | "premium";

const iconTone: Record<TileTone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success/10 text-success",
  danger: "bg-destructive/10 text-destructive",
  premium:
    "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300",
};

function InfoTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: TileTone;
}) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            iconTone[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
      <div>
        <p className="truncate text-base font-semibold">{value}</p>
        {hint ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export function ProfileStatusTiles({ user }: { user: ProfileUser }) {
  const isPremium = user.subscriptionPlan === "premium";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Reveal delay={0.05}>
        <InfoTile
          icon={ShieldCheck}
          label="Account status"
          value={user.isBlocked ? "Blocked" : "Active"}
          hint={
            user.isBlocked ? "Contact support for help" : "You're good to order"
          }
          tone={user.isBlocked ? "danger" : "success"}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <InfoTile
          icon={isPremium ? Crown : Sparkles}
          label="Subscription"
          value={isPremium ? "Premium" : "Free"}
          hint={
            isPremium
              ? "All premium features unlocked"
              : "Upgrade anytime for more"
          }
          tone={isPremium ? "premium" : "default"}
        />
      </Reveal>
      <Reveal delay={0.15}>
        <InfoTile
          icon={Fingerprint}
          label="Account ID"
          value={`${user.id.slice(0, 12)}…`}
          hint="Used to identify your account"
        />
      </Reveal>
    </div>
  );
}
