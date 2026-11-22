"use server";

import { headers } from "next/headers";

import { requireRole } from "@/app/dashboard/lib/require-role";
import { auth } from "@/lib/auth";
import {
  restaurantInfoSchema,
  type RestaurantInfoValues,
} from "@/lib/vendor/validation";

export type UpdateRestaurantResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateRestaurantInfo(
  input: RestaurantInfoValues,
): Promise<UpdateRestaurantResult> {
  // Only vendors can change restaurant details.
  await requireRole("vendor");

  const parsed = restaurantInfoSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid restaurant details.",
    };
  }

  try {
    await auth.api.updateUser({
      body: parsed.data,
      headers: await headers(),
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update restaurant details. Please try again.",
    };
  }
}
