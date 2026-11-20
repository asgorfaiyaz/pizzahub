import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, StoreIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import type { MenuItem } from "@/lib/menu-items/types";

type MenuItemCardProps = {
  item: MenuItem;
  href: string;
};

export function MenuItemCard({ item, href }: MenuItemCardProps) {
  const vendor = item.vendor;
  const vendorName = vendor?.businessName ?? vendor?.name;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card text-foreground transition-colors hover:bg-muted/20">
      {item.images[0] ? (
        <div className="relative aspect-4/3 w-full overflow-hidden border-b bg-muted">
          <Image
            src={item.images[0]}
            alt={item.itemName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {item.itemName}
          </h3>
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <span className="text-xs text-muted-foreground">{item.category}</span>

        {item.location ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPinIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{item.location}</span>
          </p>
        ) : null}

        {vendorName ? (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StoreIcon className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{vendorName}</span>
          </p>
        ) : null}

        <Link
          href={href}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-2 w-full",
          )}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
