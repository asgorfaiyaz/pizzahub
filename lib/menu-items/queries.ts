import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type { MenuItem, MenuItemResponse, MenuItemsResponse } from "./types";

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await serverApiFetch<MenuItemsResponse>("/menu-items", {
    auth: "none",
    method: "GET",
  });

  return response.data;
}

export async function getMenuItemById(id: string): Promise<MenuItem> {
  const response = await serverApiFetch<MenuItemResponse>(
    `/menu-items/${encodeURIComponent(id)}`,
    {
      auth: "none",
      method: "GET",
    },
  );

  return response.data;
}
