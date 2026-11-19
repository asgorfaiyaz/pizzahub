import "server-only";

type ImgBBResponse = {
  success?: boolean;
  data?: {
    url?: string;
  };
  error?: {
    message?: string;
  };
};

export async function uploadImageToImgBB(file: File) {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("IMGBB_API_KEY is not configured.");
  }

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", file, file.name);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });
  const payload = (await response
    .json()
    .catch(() => null)) as ImgBBResponse | null;

  if (!response.ok || !payload?.success || !payload.data?.url) {
    throw new Error(
      payload?.error?.message ?? `ImgBB upload failed (${response.status}).`,
    );
  }

  return payload.data.url;
}
