import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/home/reveal";

export function AuthCard({
  title,
  description,
  alternate,
  children,
  animate = true,
}: {
  title: string;
  description: string;
  alternate: ReactNode;
  children: ReactNode;
  animate?: boolean;
}) {
  const card = (
    <section className="w-full">
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
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
  );

  if (!animate) return card;

  return <Reveal>{card}</Reveal>;
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
      className="font-medium text-primary underline-offset-4 hover:underline"
      href={href}
    >
      {children}
    </Link>
  );
}
