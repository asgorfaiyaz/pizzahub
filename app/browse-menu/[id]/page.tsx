import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ChevronRightIcon, MapPinIcon } from "lucide-react";

import { getMenuItemById } from "@/lib/menu-items/queries";
import { MenuItemGallery } from "@/components/menu-items/menu-item-gallery";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function BrowseMenuItemDetailsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-4/3 w-full" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="mt-4 h-5 w-20 rounded-full" />
          <Skeleton className="mt-4 h-4 w-1/3" />
          <Skeleton className="mt-6 flex-1" />
        </div>
      </div>
    </main>
  );
}

async function BrowseMenuItemDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let item;
  try {
    item = await getMenuItemById(id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link
          href="/browse-menu"
          className="hover:text-foreground transition-colors"
        >
          Browse Menu
        </Link>
        <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">{item.category}</span>
        <ChevronRightIcon className="size-3.5 shrink-0" aria-hidden />
        <span className="max-w-60 truncate font-medium text-foreground">
          {item.itemName}
        </span>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image gallery */}
        <MenuItemGallery images={item.images} alt={item.itemName} />

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {item.itemName}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{item.category}</Badge>
            <span className="text-2xl font-semibold tabular-nums">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.location ? (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" aria-hidden />
              {item.location}
            </p>
          ) : null}

          <Separator className="my-6" />

          <section aria-labelledby="about-item">
            <h2
              id="about-item"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              About this dish
            </h2>
            <p className="mt-3 leading-7 text-foreground">{item.description}</p>
          </section>

          <div className="mt-auto pt-8">
            <Link
              href="/browse-menu"
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeftIcon />
              Back to menu
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BrowseMenuItemPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<BrowseMenuItemDetailsSkeleton />}>
      <BrowseMenuItemDetails {...props} />
    </Suspense>
  );
}
