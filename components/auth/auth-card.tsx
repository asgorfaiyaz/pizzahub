import Link from "next/link";
import type { ReactNode } from "react";
import { Pizza } from "lucide-react";

export function AuthCard({
  title,
  description,
  alternate,
  children,
}: {
  title: string;
  description: string;
  alternate: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
      <section className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Pizza className="size-5 text-primary" aria-hidden="true" />
            PizzaHub
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </header>
        {children}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {alternate}
        </p>
      </section>
    </main>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="font-medium text-foreground underline-offset-4 hover:underline"
      href={href}
    >
      {children}
    </Link>
  );
}
