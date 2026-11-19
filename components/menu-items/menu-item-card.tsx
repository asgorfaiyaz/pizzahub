import Link from "next/link";
import Image from "next/image";

import type { MenuItem } from "@/lib/menu-items/types";

type MenuItemCardProps = {
  item: MenuItem;
  href: string;
};

export function MenuItemCard({ item, href }: MenuItemCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card text-foreground transition-colors hover:bg-muted/40"
    >
      {item.images[0] ? (
        <div className="relative aspect-square w-full overflow-hidden border-b">
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
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
          {item.itemName}
        </h3>

        {item.description ? (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {item.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <span className="truncate text-xs text-muted-foreground">
            {item.category}
          </span>
          <span className="text-sm font-semibold tabular-nums">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
