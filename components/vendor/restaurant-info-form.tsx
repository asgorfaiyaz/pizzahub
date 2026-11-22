"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";

import { updateRestaurantInfo } from "@/lib/vendor/actions";
import {
  restaurantInfoSchema,
  type RestaurantInfoValues,
} from "@/lib/vendor/validation";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

type RestaurantInfoFormProps = {
  initialValues: RestaurantInfoValues;
};

export function RestaurantInfoForm({
  initialValues,
}: RestaurantInfoFormProps) {
  const router = useRouter();
  const form = useForm<RestaurantInfoValues>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: RestaurantInfoValues) {
    try {
      const result = await updateRestaurantInfo(values);

      if (!result.ok) {
        toast.add({
          title: "Update failed",
          description: result.message,
          type: "error",
          timeout: 5000,
        });
        return;
      }

      toast.add({
        title: "Restaurant updated",
        description: "Your restaurant details have been saved.",
        type: "success",
        timeout: 5000,
      });
      router.refresh();
    } catch {
      toast.add({
        title: "Update failed",
        description: "Something went wrong. Please try again.",
        type: "error",
        timeout: 5000,
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            className="sm:col-span-2"
            data-invalid={!!form.formState.errors.businessName}
          >
            <FieldLabel htmlFor="businessName">Restaurant name</FieldLabel>
            <Input
              id="businessName"
              autoComplete="organization"
              placeholder="Alex's Pizza"
              aria-invalid={!!form.formState.errors.businessName}
              {...form.register("businessName")}
            />
            <FieldError errors={[form.formState.errors.businessName]} />
          </Field>

          <Field
            className="sm:col-span-2"
            data-invalid={!!form.formState.errors.restaurantLocation}
          >
            <FieldLabel htmlFor="restaurantLocation">
              Restaurant location
            </FieldLabel>
            <Input
              id="restaurantLocation"
              autoComplete="address-level2"
              placeholder="Downtown, Sylhet"
              aria-invalid={!!form.formState.errors.restaurantLocation}
              {...form.register("restaurantLocation")}
            />
            <FieldError errors={[form.formState.errors.restaurantLocation]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.restaurantOpeningTime}>
            <FieldLabel htmlFor="restaurantOpeningTime">
              Opening time
            </FieldLabel>
            <Input
              id="restaurantOpeningTime"
              type="time"
              aria-invalid={!!form.formState.errors.restaurantOpeningTime}
              {...form.register("restaurantOpeningTime")}
            />
            <FieldError errors={[form.formState.errors.restaurantOpeningTime]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.restaurantClosingTime}>
            <FieldLabel htmlFor="restaurantClosingTime">
              Closing time
            </FieldLabel>
            <Input
              id="restaurantClosingTime"
              type="time"
              aria-invalid={!!form.formState.errors.restaurantClosingTime}
              {...form.register("restaurantClosingTime")}
            />
            <FieldError errors={[form.formState.errors.restaurantClosingTime]} />
          </Field>

          <Field
            className="sm:col-span-2"
            data-invalid={!!form.formState.errors.restaurantPhone}
          >
            <FieldLabel htmlFor="restaurantPhone">
              Restaurant phone (optional)
            </FieldLabel>
            <Input
              id="restaurantPhone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 000 1234"
              aria-invalid={!!form.formState.errors.restaurantPhone}
              {...form.register("restaurantPhone")}
            />
            <FieldError errors={[form.formState.errors.restaurantPhone]} />
          </Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save />
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
