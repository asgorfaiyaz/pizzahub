"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.");

const signUpSchema = signInSchema.extend({
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters.").max(80),
  role: z.enum(["customer", "vendor"]),
  businessName: z.string().trim().max(120).optional(),
  restaurantLocation: z.string().trim().max(160).optional(),
  restaurantOpeningTime: z.string().optional(),
  restaurantClosingTime: z.string().optional(),
  restaurantPhone: z.string().trim().max(30).optional(),
}).superRefine((values, context) => {
  if (values.role === "vendor" && !values.businessName?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["businessName"],
      message: "Business name is required for vendor accounts.",
    });
  }
  if (values.role === "vendor" && !values.restaurantLocation?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["restaurantLocation"],
      message: "Restaurant location is required for vendor accounts.",
    });
  }
  if (values.role === "vendor" && !values.restaurantOpeningTime?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["restaurantOpeningTime"],
      message: "Opening time is required for vendor accounts.",
    });
  }
  if (values.role === "vendor" && !values.restaurantClosingTime?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["restaurantClosingTime"],
      message: "Closing time is required for vendor accounts.",
    });
  }
});

type AuthValues = {
  name?: string;
  email: string;
  password: string;
  role?: "customer" | "vendor";
  businessName?: string;
  restaurantLocation?: string;
  restaurantOpeningTime?: string;
  restaurantClosingTime?: string;
  restaurantPhone?: string;
};

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [googlePending, setGooglePending] = useState(false);
  const form = useForm<AuthValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema) as never,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
      businessName: "",
      restaurantLocation: "",
      restaurantOpeningTime: "",
      restaurantClosingTime: "",
      restaurantPhone: "",
    },
  });

  async function onSubmit(values: AuthValues) {
    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: values.name ?? "",
            email: values.email,
            password: values.password,
            role: values.role ?? "customer",
            businessName: values.businessName?.trim() || undefined,
            restaurantLocation: values.restaurantLocation?.trim() || undefined,
            restaurantOpeningTime: values.restaurantOpeningTime || undefined,
            restaurantClosingTime: values.restaurantClosingTime || undefined,
            restaurantPhone: values.restaurantPhone?.trim() || undefined,
            callbackURL: "/sign-in",
          })
        : await authClient.signIn.email({
            email: values.email,
            password: values.password,
          });

      if (result.error) {
        toast.add({
          title: isSignUp ? "Sign-up failed" : "Sign-in failed",
          description:
            result.error.message ?? "Unable to complete authentication.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: isSignUp ? "Account created" : "Signed in",
        description: isSignUp
          ? "Your account is ready. Sign in to continue."
          : "You’re now signed in to PizzaHub.",
        type: "success",
        timeout: 5000,
      });
      const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
      const destination =
        callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
          ? callbackUrl
          : "/";
      router.replace(isSignUp ? "/sign-in" : destination);
      router.refresh();
    } catch {
      toast.add({
        title: isSignUp ? "Sign-up failed" : "Sign-in failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  async function onGoogleSignIn() {
    setGooglePending(true);
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (!result.error) return;
      setGooglePending(false);
      toast.add({
        title: "Google sign-in failed",
        description: result.error.message ?? "Unable to continue with Google.",
        type: "error",
      });
    } catch {
      setGooglePending(false);
      toast.add({
        title: "Google sign-in failed",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={googlePending || form.formState.isSubmitting}
        onClick={onGoogleSignIn}
      >
        <GoogleMark />
        Continue with Google
      </Button>
      <FieldSeparator>or continue with email</FieldSeparator>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {isSignUp ? (
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input
                id="name"
                autoComplete="name"
                placeholder="Alex Morgan"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
          ) : null}
          {isSignUp ? (
            <RolePicker control={form.control} setValue={form.setValue} />
          ) : null}
          {isSignUp ? (
            <VendorDetailsFields
              control={form.control}
              register={form.register}
              errors={form.formState.errors}
            />
          ) : null}
          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!form.formState.errors.email}
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder={isSignUp ? "6+ characters, A and a" : "Your password"}
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            {isSignUp ? (
              <p className="text-xs text-muted-foreground">
                Use at least 6 characters with one uppercase and one lowercase
                letter.
              </p>
            ) : null}
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting || googlePending}
          >
            {form.formState.isSubmitting
              ? "Please wait..."
              : isSignUp
                ? "Create PizzaHub account"
                : "Sign in"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

const RolePicker = function RolePicker({
  control,
  setValue,
}: {
  control: Control<AuthValues>;
  setValue: UseFormSetValue<AuthValues>;
}) {
  const selectedRole = useWatch({ control, name: "role" });

  return (
    <Field>
      <FieldLabel id="role-label">I am joining as</FieldLabel>
      <div
        role="group"
        aria-labelledby="role-label"
        className="grid grid-cols-2 gap-2"
      >
        {(["customer", "vendor"] as const).map((role) => (
          <Button
            key={role}
            type="button"
            variant={selectedRole === role ? "default" : "outline"}
            aria-pressed={selectedRole === role}
            onClick={() => setValue("role", role)}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Customer accounts can order pizza; vendor accounts can manage a shop.
      </p>
    </Field>
  );
};

const VendorDetailsFields = function VendorDetailsFields({
  control,
  register,
  errors,
}: {
  control: Control<AuthValues>;
  register: ReturnType<typeof useForm<AuthValues>>["register"];
  errors: FieldErrors<AuthValues>;
}) {
  const selectedRole = useWatch({ control, name: "role" });

  if (selectedRole !== "vendor") return null;

  const fields = [
    {
      name: "businessName" as const,
      label: "Restaurant name",
      placeholder: "Alex's Pizza",
      type: "text",
      autoComplete: "organization",
    },
    {
      name: "restaurantLocation" as const,
      label: "Restaurant location",
      placeholder: "Downtown, Sylhet",
      type: "text",
      autoComplete: "address-level2",
    },
    {
      name: "restaurantOpeningTime" as const,
      label: "Opening time",
      placeholder: "",
      type: "time",
      autoComplete: "off",
    },
    {
      name: "restaurantClosingTime" as const,
      label: "Closing time",
      placeholder: "",
      type: "time",
      autoComplete: "off",
    },
    {
      name: "restaurantPhone" as const,
      label: "Restaurant phone (optional)",
      placeholder: "+1 555 000 1234",
      type: "tel",
      autoComplete: "tel",
    },
  ];

  return (
    <div className="grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-2">
      <p className="text-xs font-medium text-muted-foreground sm:col-span-2">
        Restaurant details — these appear on your vendor dashboard.
      </p>
      {fields.map((field) => {
        const error = errors[field.name];

        return (
          <Field key={field.name} data-invalid={!!error}>
            <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
            <Input
              id={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              aria-invalid={!!error}
              {...register(field.name)}
            />
            <FieldError errors={[error]} />
          </Field>
        );
      })}
    </div>
  );
};

function GoogleMark() {
  return (
    <span aria-hidden="true" className="font-semibold text-base">
      G
    </span>
  );
}
