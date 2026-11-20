import "server-only";

import { serverApiFetch } from "@/lib/server-api";
import type {
  LocationsResponse,
  MenuItem,
  MenuItemResponse,
  MenuItemStatus,
  MenuItemsResponse,
  Pagination,
} from "./types";

export type MenuItemsQuery = {
  search?: string;
  category?: string;
  location?: string;
  status?: MenuItemStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type MenuItemsPage = {
  items: MenuItem[];
  pagination: Pagination;
};

/** Locations served by the dedicated `/menu-items/locations` endpoint. */
export async function getLocations(): Promise<string[]> {
  const response = await serverApiFetch<LocationsResponse>(
    "/menu-items/locations",
    {
      auth: "none",
      method: "GET",
    },
  );

  return response.data;
}

export async function getMenuItems(
  query: MenuItemsQuery = {},
): Promise<MenuItemsPage> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.location) params.set("location", query.location);
  if (query.status) params.set("status", query.status);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const queryString = params.toString();

  const response = await serverApiFetch<MenuItemsResponse>(
    `/menu-items${queryString ? `?${queryString}` : ""}`,
    {
      auth: "none",
      method: "GET",
    },
  );

  const pagination = response.pagination ?? {
    total: response.data.length,
    page: query.page ?? 1,
    limit: response.data.length,
    totalPages: 1,
  };

  return { items: response.data, pagination };
}

export async function getVendorMenuItems(): Promise<MenuItem[]> {
  const response = await serverApiFetch<MenuItemsResponse>(
    "/vendors/menu-items",
    {
      auth: "required",
      method: "GET",
    },
  );

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
