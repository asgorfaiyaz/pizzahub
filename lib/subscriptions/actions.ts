"use server";

import { serverApiFetch } from "@/lib/server-api";
import type { CheckoutSessionResponse } from "./types";

export type CheckoutSessionResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

export async function createCheckoutSession(): Promise<CheckoutSessionResult> {
  try {
    const response = await serverApiFetch<CheckoutSessionResponse>(
      "/vendors/subscription/create-checkout-session",
      {
        auth: "required",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      },
    );

    if (!response.data?.url) {
      return {
        ok: false,
        message: "Checkout session URL was not returned.",
      };
    }

    return { ok: true, url: response.data.url };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again.",
    };
  }
}
