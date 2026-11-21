"use server";

import { serverApiFetch } from "@/lib/server-api";
import { getServerSession } from "@/lib/server-session";
import type { ActionResponse } from "@/lib/menu-items/types";

export type PlaceOrderInput = {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
};

export async function createOrder(input: PlaceOrderInput) {
  const session = await getServerSession();

  if (session?.user.role !== "customer") {
    throw new Error("Only customers can place orders.");
  }

  return serverApiFetch<ActionResponse>("/orders", {
    auth: "required",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
