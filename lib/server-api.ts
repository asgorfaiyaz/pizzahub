import "server-only";
import { getToken } from "@/lib/server-session";

export type ServerApiAuth = "required" | "optional" | "none";

type ServerApiFetchOptions = RequestInit & {
  auth?: ServerApiAuth;
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) return payload;

  if (payload && typeof payload === "object" && "message" in payload) {
    const message = payload.message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

export async function serverApiFetch<T>(
  path: string,
  {
    auth = "required",
    headers: requestHeaders,
    ...options
  }: ServerApiFetchOptions = {},
) {
  const serverUrl = process.env.SERVER_URL;

  if (!serverUrl) {
    throw new Error("SERVER_URL is not configured.");
  }

  const headers = new Headers(requestHeaders);

  if (auth !== "none") {
    const token = await getToken();

    if (!token && auth === "required") {
      throw new Error("You must be signed in to make this request.");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers,
  });

  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok) {
    throw new Error(
      getErrorMessage(payload, `API request failed (${response.status}).`),
    );
  }

  if (payload === null) {
    throw new Error("API returned an empty response.");
  }

  return payload;
}
