import { Suspense } from "react";

import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

type SignInSearchParams = {
  reason?: string | string[];
};

function SignInCard({ reason }: { reason?: string }) {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to discover local pizza shops, track orders, and find your next favorite slice."
      alternate={
        <>
          New to PizzaHub? <AuthLink href="/sign-up">Create an account</AuthLink>
        </>
      }
    >
      {reason === "blocked" ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          Your account has been blocked. Contact support if you think this is a
          mistake.
        </div>
      ) : null}
      <AuthForm mode="sign-in" />
    </AuthCard>
  );
}

async function SignInContent({
  searchParams,
}: {
  searchParams: Promise<SignInSearchParams>;
}) {
  const params = await searchParams;
  const reason = Array.isArray(params.reason) ? params.reason[0] : params.reason;

  return <SignInCard reason={reason} />;
}

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<SignInSearchParams>;
}) {
  return (
    <Suspense fallback={<SignInCard />}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}
