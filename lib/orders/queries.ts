import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type { Order, OrdersResponse } from "./types";

export async function getMyOrders(): Promise<Order[]> {
  const response = await serverApiFetch<OrdersResponse>("/customers/orders", {
    auth: "required",
    method: "GET",
  });

  return response.data;
}
