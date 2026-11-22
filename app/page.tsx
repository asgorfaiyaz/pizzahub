import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { getMenuItems } from "@/lib/menu-items/queries";
import { MENU_ITEM_CATEGORIES } from "@/lib/menu-items/types";
import { MenuItemCard } from "@/components/menu-items/menu-item-card";
import { Reveal } from "@/components/home/reveal";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80";

const CATEGORY_EMOJIS = ["🍕", "🥬", "🥓", "🍕", "🍟", "🥤"];

const benefits: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Store,
    title: "Neighborhood favorites",
    description:
      "Discover independent pizza kitchens right in your area, not just chain stores.",
  },
  {
    icon: Sparkles,
    title: "Freshly made",
    description:
      "Every item is prepared to order, so your pizza arrives hot and full of flavor.",
  },
  {
    icon: Clock3,
    title: "Simple ordering",
    description:
      "Browse menus, choose your favorites, and check out in just a few taps.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted kitchens",
    description:
      "Only approved vendors make it onto PizzaHub, so you know what you're getting.",
  },
];

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Search,
    title: "Find your slice",
    description:
      "Search by pizza style, category, or location to find something you'll love.",
  },
  {
    icon: UtensilsCrossed,
    title: "Place your order",
    description:
      "Pick an item, add your delivery details, and confirm your order in seconds.",
  },
  {
    icon: Truck,
    title: "Enjoy it hot",
    description:
      "Your local kitchen prepares it fresh and sends it straight to your door.",
  },
];

function FeaturedSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-xl border bg-card"
        >
          <Skeleton className="aspect-4/3 w-full" />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="mt-2 h-7 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function FeaturedItems() {
  const { items } = await getMenuItems({ status: "approved", limit: 12 });
  const featured = items
    .filter((item) => item.status === "approved")
    .slice(0, 8);

  if (featured.length === 0) {
    return (
      <Card className="mt-8 items-center gap-2 py-16 text-center">
        <p className="font-medium">Featured items are on their way</p>
        <p className="text-sm text-muted-foreground">
          Check back soon — local kitchens are adding their menus.
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {featured.map((item, index) => (
        <Reveal key={item._id} delay={index * 0.04}>
          <MenuItemCard item={item} href={`/menu/${item._id}`} />
        </Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border bg-card">
          <div className="absolute inset-0">
            <Image
              src={HERO_IMAGE}
              alt="Freshly baked pizza on a table"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/10 dark:from-background/95 dark:via-background/80" />
          </div>

          <Reveal className="relative z-10 max-w-2xl px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
            <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Hot &amp; Fresh Pizza Delivered to Your Door
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover neighborhood pizza shops, browse their menus, and order
              something delicious — made fresh and delivered warm.
            </p>
            <Link
              href="/browse-menu"
              className={buttonVariants({ size: "lg", className: "mt-8" })}
            >
              Explore Pizza Menu
              <ArrowRight />
            </Link>
          </Reveal>
        </section>

        {/* Featured items */}
        <section className="mt-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Featured menu items
                </h2>
                <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
                  A taste of what local kitchens are serving right now.
                </p>
              </div>
              <Link
                href="/browse-menu"
                className={buttonVariants({ variant: "outline" })}
              >
                Browse all items
                <ArrowRight />
              </Link>
            </div>
          </Reveal>

          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedItems />
          </Suspense>
        </section>

        {/* Categories */}
        <section className="mt-24">
          <Reveal>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pizza categories
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              Jump straight to the kind of pizza — or side — you&apos;re in the
              mood for.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MENU_ITEM_CATEGORIES.map((category, index) => (
              <Reveal key={category} delay={index * 0.04}>
                <Link
                  href={`/browse-menu?category=${encodeURIComponent(category)}`}
                  className="group block"
                >
                  <Card className="flex items-center gap-4 p-5 transition-colors hover:bg-accent/50">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                      {CATEGORY_EMOJIS[index]}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">
                        {category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Explore items
                      </span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Why PizzaHub */}
        <section className="mt-24">
          <Reveal>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Why PizzaHub?
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
              We bring great local kitchens and hungry pizza lovers together.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 0.05}>
                <Card className="h-full gap-3 p-5">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{benefit.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-24 mb-16 rounded-3xl border bg-card p-6 sm:p-10 lg:p-12">
          <Reveal>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From craving to doorstep
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <step.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
