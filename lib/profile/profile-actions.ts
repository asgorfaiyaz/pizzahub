"use server";

import { uploadImageToImgBB } from "@/lib/imgbb";
import { getServerSession } from "@/lib/server-session";

export async function uploadProfileImage(file: File): Promise<string> {
  const session = await getServerSession();

  if (!session?.user.id) {
    throw new Error("You must be signed in to upload a profile image.");
  }

  return uploadImageToImgBB(file);
}
