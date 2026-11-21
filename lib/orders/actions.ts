"use server";

import { serverApiFetch } from "@/lib/server-api";
import { getServerSession } from "@/lib/server-session";
import type { ActionResponse } from "@/lib/menu-items/types";
import type { CancelOrderResponse } from "./types";

export type PlaceOrderInput = {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
};

export async function cancelOrder(orderId: string) {
  if (!orderId) {
    throw new Error("An order id is required to cancel an order.");
  }

  return serverApiFetch<CancelOrderResponse>(
    `/customers/orders/${encodeURIComponent(orderId)}/cancel`,
    {
      auth: "required",
      method: "PATCH",
    },
  );
}

export async function createOrder(input: PlaceOrderInput) {
  const session = await getServerSession();

  if (session?.user.role !== "customer") {
    throw new Error("Only customers can place orders.");
  }

  return serverApiFetch<ActionResponse>("/customers/orders", {
    auth: "required",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}
