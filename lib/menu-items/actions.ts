"use server";

import { uploadImageToImgBB } from "@/lib/imgbb";
import { serverApiFetch } from "@/lib/server-api";
import type {
  ActionResponse,
  ApiResponse,
  CreateMenuItemInput,
  MenuItem,
  MenuItemStatus,
  UpdateMenuItemInput,
} from "./types";

export async function createMenuItem(input: CreateMenuItemInput) {
  return serverApiFetch<ApiResponse<MenuItem>>("/vendors/menu-items", {
    auth: "required",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      status: "pending",
    }),
  });
}

export async function uploadMenuItemImages(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadImageToImgBB));
}

export async function updateMenuItem(id: string, input: UpdateMenuItemInput) {
  if (!id) {
    throw new Error("A menu item id is required.");
  }

  return serverApiFetch<ApiResponse<MenuItem>>(
    `/vendors/menu-items/${encodeURIComponent(id)}`,
    {
      auth: "required",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  );
}

export async function deleteMenuItem(id: string) {
  return serverApiFetch<ActionResponse>(
    `/vendors/menu-items/${encodeURIComponent(id)}`,
    {
      auth: "required",
      method: "DELETE",
    },
  );
}

export async function setMenuItemAvailability(
  id: string,
  isAvailable: boolean,
) {
  if (!id) throw new Error("A menu item id is required.");

  return updateMenuItem(id, { status: isAvailable ? "approved" : "inactive" });
}

export async function setAdminMenuItemStatus(
  id: string,
  status: MenuItemStatus,
) {
  if (!id) throw new Error("A menu item id is required.");

  return serverApiFetch<ActionResponse>(
    `/admin/menu-items/${encodeURIComponent(id)}/status`,
    {
      auth: "required",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
  );
}

export async function deleteAdminMenuItem(id: string) {
  if (!id) throw new Error("A menu item id is required.");

  return serverApiFetch<ActionResponse>(
    `/admin/menu-items/${encodeURIComponent(id)}`,
    {
      auth: "required",
      method: "DELETE",
    },
  );
}
