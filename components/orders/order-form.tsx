"use client";

import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type OrderFormValues = {
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
};

type OrderFormProps = {
  itemId: string;
  itemName: string;
  price: number;
  onClose: () => void;
};

export function OrderForm({
  itemId,
  itemName,
  price,
  onClose,
}: OrderFormProps) {
  const router = useRouter();
  const form = useForm<OrderFormValues>({
    defaultValues: {
      deliveryDate: "",
      deliveryAddress: "",
      message: "",
    },
  });

  function onSubmit(values: OrderFormValues) {
    const params = new URLSearchParams({ itemId });

    if (values.deliveryDate) params.set("deliveryDate", values.deliveryDate);
    if (values.deliveryAddress.trim()) {
      params.set("deliveryAddress", values.deliveryAddress.trim());
    }
    if (values.message?.trim()) {
      params.set("message", values.message.trim());
    }

    const queryString = params.toString();
    router.push(
      queryString ? `/checkout/demo?${queryString}` : "/checkout/demo",
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-2xl rounded-2xl border bg-card p-6 sm:p-8"
    >
      {/* Header: item summary + close */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Place your order
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemName} — ${price.toFixed(2)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close order form"
          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
        >
          <XIcon />
        </button>
      </div>

      {/* Fields */}
      <FieldGroup className="mt-5">
        <Field data-invalid={!!form.formState.errors.deliveryDate}>
          <FieldLabel htmlFor="order-delivery-date">Delivery date</FieldLabel>
          <Input
            id="order-delivery-date"
            type="date"
            aria-invalid={!!form.formState.errors.deliveryDate}
            {...form.register("deliveryDate", {
              required: "Please select a delivery date.",
              validate: (value) => {
                if (!value) {
                  return "Please select a delivery date.";
                }

                // "YYYY-MM-DD" strings compare lexicographically.
                const today = new Date().toISOString().slice(0, 10);

                if (value < today) {
                  return "Delivery date must be today or later.";
                }

                return true;
              },
            })}
          />
          <FieldError errors={[form.formState.errors.deliveryDate]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.deliveryAddress}>
          <FieldLabel htmlFor="order-delivery-address">
            Delivery address
          </FieldLabel>
          <Input
            id="order-delivery-address"
            aria-invalid={!!form.formState.errors.deliveryAddress}
            placeholder="Your delivery address"
            {...form.register("deliveryAddress", {
              required: "Please enter your delivery address.",
              minLength: {
                value: 3,
                message: "Enter a valid delivery address.",
              },
            })}
          />
          <FieldError errors={[form.formState.errors.deliveryAddress]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.message}>
          <FieldLabel htmlFor="order-message">
            Additional message (optional)
          </FieldLabel>
          <Input
            id="order-message"
            aria-invalid={!!form.formState.errors.message}
            placeholder="Special instructions or food notes"
            {...form.register("message")}
          />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Continue to checkout
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
