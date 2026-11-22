import {
  Check,
  Crown,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { VendorSubscriptionStatus } from "@/lib/subscriptions/types";
import { UpgradeButton } from "@/components/subscription/upgrade-button";
import { Reveal } from "@/components/home/reveal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Plan = {
  id: "free" | "premium";
  name: string;
  tagline: string;
  icon: LucideIcon;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Everything you need to get started.",
    icon: Sparkles,
    features: [
      "Max 3 active menu items",
      "Basic vendor dashboard",
      "Order management",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "For shops ready to stand out.",
    icon: Crown,
    features: [
      "Unlimited active items",
      "Premium vendor badge",
      "Featured menu placement",
      "All Free features",
    ],
  },
];

export function PlanComparison({
  status,
}: {
  status: VendorSubscriptionStatus;
}) {
  return (
    <section className="mt-14" aria-labelledby="plans-heading">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">Compare plans</p>
            <h2
              id="plans-heading"
              className="mt-1 text-2xl font-semibold tracking-tight"
            >
              Choose what fits your shop
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upgrade any time — your menu and orders stay right where they
              are.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((plan, index) => {
          const isCurrent = status.plan === plan.id;
          const isPremiumPlan = plan.id === "premium";

          return (
            <Reveal key={plan.id} delay={index * 0.08}>
              <Card
                className={cn(
                  "relative h-full gap-5 overflow-hidden p-6",
                  isCurrent && isPremiumPlan &&
                    "border-amber-300/70 bg-amber-50/40 dark:border-amber-400/25 dark:bg-amber-400/5",
                  isCurrent && !isPremiumPlan && "border-primary/50",
                )}
              >
                {isCurrent ? (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-3 py-1 text-[0.7rem] font-semibold text-primary-foreground">
                    Current plan
                  </div>
                ) : null}

                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl",
                      isPremiumPlan
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <plan.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                          isPremiumPlan
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300"
                            : "bg-primary/10 text-primary",
                        )}
                      >
                        <Check className="size-3" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  {isCurrent ? (
                    <Badge variant={isPremiumPlan ? "default" : "secondary"}>
                      {isPremiumPlan ? "Premium active" : "Your current plan"}
                    </Badge>
                  ) : isPremiumPlan ? (
                    <UpgradeButton />
                  ) : null}
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
