import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  SubscriptionStatusResponse,
  VendorSubscriptionStatus,
} from "./types";

export async function getVendorSubscription(): Promise<VendorSubscriptionStatus> {
  const response = await serverApiFetch<SubscriptionStatusResponse>(
    "/vendors/subscription",
    {
      auth: "required",
      method: "GET",
    },
  );

  return response.data;
}
