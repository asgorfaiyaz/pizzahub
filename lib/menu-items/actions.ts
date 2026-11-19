"use server";

import { uploadImageToImgBB } from "@/lib/imgbb";
import { serverApiFetch } from "@/lib/server-api";
import type {
  ActionResponse,
  ApiResponse,
  CreateMenuItemInput,
  MenuItem,
  UpdateMenuItemInput,
} from "./types";

export async function createMenuItem(input: CreateMenuItemInput) {
  return serverApiFetch<ApiResponse<MenuItem>>("/menu-items", {
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
    `/menu-items/${encodeURIComponent(id)}`,
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
    `/menu-items/${encodeURIComponent(id)}`,
    {
      auth: "required",
      method: "DELETE",
    },
  );
}
