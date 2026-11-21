import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  PaymentConfirmation,
  PaymentConfirmationResponse,
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

export async function getPaymentConfirmation(
  sessionId: string,
): Promise<PaymentConfirmation> {
  const params = new URLSearchParams({ session_id: sessionId });

  const response = await serverApiFetch<PaymentConfirmationResponse>(
    `/vendors/subscription/confirmation?${params.toString()}`,
    {
      auth: "required",
      method: "GET",
    },
  );

  return response.data;
}
