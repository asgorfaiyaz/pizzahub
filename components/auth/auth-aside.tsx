import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  Pizza,
  Sparkles,
  Star,
  Store,
  Truck,
} from "lucide-react";

import { Reveal } from "@/components/home/reveal";

const AUTH_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80";

const highlights = [
  { icon: Store, label: "Local kitchens" },
  { icon: Truck, label: "Delivered warm" },
  { icon: Star, label: "Top rated" },
  { icon: Heart, label: "Made fresh" },
];

export function AuthAside() {
  return (
    <aside className="relative hidden w-[52%] shrink-0 overflow-hidden bg-[#24100c] lg:flex lg:flex-col">
      <Image
        src={AUTH_IMAGE}
        alt="Fresh pizza on a table"
        fill
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b0a07]/85 via-[#1b0a07]/50 to-[#1b0a07]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(239,68,68,0.28),transparent_45%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2.5 text-white outline-none focus-visible:ring-3 focus-visible:ring-white/50"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Pizza className="size-5" aria-hidden />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight">
            PizzaHub
          </span>
        </Link>

        <Reveal>
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="size-3.5" />
              Fresh from local kitchens
            </span>

            <h2 className="mt-6 font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-white sm:text-5xl">
              Your next favorite slice is one click away.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-white/90 [text-shadow:0_1px_6px_rgba(0,0,0,0.75)]">
              Discover neighborhood pizza shops, browse real menus, and order
              food that arrives hot and ready to enjoy.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white/85 backdrop-blur-sm"
                >
                  <Icon
                    className="size-4 shrink-0 text-orange-300"
                    aria-hidden
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="flex items-center justify-between text-sm text-white/55">
          <p>© 2026 PizzaHub</p>
          <Link
            href="/browse-menu"
            className="inline-flex items-center gap-1 text-white/80 transition-colors hover:text-white"
          >
            Explore menu
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}
