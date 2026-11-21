import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  CustomerOverview,
  CustomerOverviewResponse,
  Order,
  OrdersResponse,
} from "./types";

export async function getCustomerOverview(): Promise<CustomerOverview> {
  const response = await serverApiFetch<CustomerOverviewResponse>(
    "/customers/overview",
    {
      auth: "required",
      method: "GET",
    },
  );

  return response.data;
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await serverApiFetch<OrdersResponse>("/customers/orders", {
    auth: "required",
    method: "GET",
  });

  return response.data;
}
