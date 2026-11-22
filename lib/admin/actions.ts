"use server";

import { getUserById } from "@/lib/admin/queries";
import type { User } from "@/lib/admin/types";

export type UserResult =
  | { ok: true; user: User }
  | { ok: false; message: string };

export async function fetchUserDetails(id: string): Promise<UserResult> {
  try {
    const user = await getUserById(id);

    return { ok: true, user };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to load user details. Please try again.",
    };
  }
}
