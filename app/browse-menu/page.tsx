"use client";
import { useAuthSession } from "@/hooks/use-auth-session";

export default function BrowseMenuPage() {
  const { user } = useAuthSession();
  if (!user) return;
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Browse Menu -{user.role}
      </h1>
      <p className="mt-3 text-muted-foreground">
        Pizza shops and menus will appear here.
      </p>
    </main>
  );
}
