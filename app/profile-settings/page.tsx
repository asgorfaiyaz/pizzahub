import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireActiveSession } from "@/lib/server-session";
import { ProfileAccountDetails } from "@/components/profile/profile-account-details";
import { ProfileAppearance } from "@/components/profile/profile-appearance";
import { ProfileEditSection } from "@/components/profile/profile-edit-section";
import { ProfileHero } from "@/components/profile/profile-hero";
import { ProfileSkeleton } from "@/components/profile/profile-skeleton";
import { ProfileStatusTiles } from "@/components/profile/profile-status-tiles";
import type { ProfileUser } from "@/components/profile/types";

async function ProfileSettingsContent() {
  const session = await requireActiveSession();
  const user = session.user;

  const profileUser: ProfileUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role ?? "customer",
    isBlocked: user.isBlocked,
    subscriptionPlan: user.subscriptionPlan,
    businessName: user.businessName,
    createdAt: user.createdAt,
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      <ProfileHero user={profileUser} />
      <ProfileStatusTiles user={profileUser} />
      <ProfileAccountDetails user={profileUser} />
      <ProfileEditSection
        name={profileUser.name}
        image={profileUser.image ?? null}
      />
      <ProfileAppearance />

      <div className="pb-4 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Profile settings
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage your details, subscription, and preferences for a more personal
          PizzaHub experience.
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSettingsContent />
      </Suspense>
    </main>
  );
}
