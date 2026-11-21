"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { XIcon } from "lucide-react";

import { createOrder } from "@/lib/orders/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

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

  async function onSubmit(values: OrderFormValues) {
    try {
      const result = await createOrder({
        itemId,
        deliveryDate: values.deliveryDate.trim(),
        deliveryAddress: values.deliveryAddress.trim(),
        message: values.message.trim() || undefined,
      });

      if (!result.success) {
        throw new Error(
          result.message || "Failed to place your order. Please try again.",
        );
      }

      toast.add({
        title: "Order placed",
        description: `Your order for ${itemName} has been placed. We'll deliver it to you soon.`,
        type: "success",
        timeout: 5000,
      });

      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.add({
        title: "Order failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to place your order. Please try again.",
        type: "error",
        timeout: 5000,
      });
    }
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
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Placing…" : "Place order"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
