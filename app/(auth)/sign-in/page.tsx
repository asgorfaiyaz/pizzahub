import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
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
      <AuthForm mode="sign-in" />
    </AuthCard>
  );
}

