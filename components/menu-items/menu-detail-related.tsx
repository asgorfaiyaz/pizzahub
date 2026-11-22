import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { getMenuItems } from "@/lib/menu-items/queries";
import { MenuItemCard } from "@/components/menu-items/menu-item-card";
import { Reveal } from "@/components/home/reveal";
import { buttonVariants } from "@/components/ui/button";

export async function MenuDetailRelated({
  category,
  currentId,
}: {
  category: string;
  currentId: string;
}) {
  const { items } = await getMenuItems({
    category,
    status: "approved",
    limit: 8,
  });
  const related = items.filter((item) => item._id !== currentId).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-20" aria-labelledby="related-heading">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Sparkles className="size-3.5" />
              Keep exploring
            </p>
            <h2
              id="related-heading"
              className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              More from {category}
            </h2>
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((item, index) => (
          <Reveal key={item._id} delay={index * 0.05}>
            <MenuItemCard item={item} href={`/menu/${item._id}`} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
