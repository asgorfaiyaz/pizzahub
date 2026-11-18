import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your PizzaHub account"
      description="Join PizzaHub to order from local shops or share your menu with hungry customers."
      alternate={
        <>
          Already have an account? <AuthLink href="/sign-in">Sign in</AuthLink>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthCard>
  );
}

