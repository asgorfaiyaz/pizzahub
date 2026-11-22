"use server";

import { unstable_rethrow } from "next/navigation";

import { getUserById } from "@/lib/admin/queries";
import { serverApiFetch } from "@/lib/server-api";
import type { User, UserResponse } from "@/lib/admin/types";

export type UserResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

export async function fetchUserDetails(id: string): Promise<UserResult> {
  try {
    const user = await getUserById(id);

    return { ok: true, user };
  } catch (error) {
    unstable_rethrow(error);

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load user details. Please try again.",
    };
  }
}

export type BlockUserResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

export async function updateUserBlockStatus(
  id: string,
  isBlocked: boolean,
): Promise<BlockUserResult> {
  try {
    const response = await serverApiFetch<UserResponse>(
      `/admin/users/${encodeURIComponent(id)}/block`,
      {
        auth: "required",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked }),
      },
    );

    return { ok: true, user: response.data };
  } catch (error) {
    unstable_rethrow(error);

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the user's block status. Please try again.",
    };
  }
}
