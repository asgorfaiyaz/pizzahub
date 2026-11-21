import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type { VendorOverview, VendorOverviewResponse } from "./types";

export async function getVendorOverview(): Promise<VendorOverview> {
  const response = await serverApiFetch<VendorOverviewResponse>(
    "/vendors/overview",
    {
      auth: "required",
      method: "GET",
    },
  );

  return response.data;
}
