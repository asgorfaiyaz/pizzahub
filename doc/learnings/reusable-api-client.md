# Why `serverApiFetch` is worth having

`lib/server-api.ts` is the single shared client for every backend request in this app. Instead of scattering `fetch()` calls with repeated URL building, auth headers, and error parsing across pages, all of that lives in one small, typed function.

## The core idea

```ts
const response = await serverApiFetch<MenuItemsResponse>("/menu-items", {
  auth: "none",
  method: "GET",
});
```

Every caller gets the same behavior: the base URL is attached, the right auth policy is applied, the JSON payload is parsed and typed, and failures become consistent errors.

## Benefits

### 1. One source of truth for the API URL

The backend base lives in `SERVER_URL` (for example `http://localhost:5000/api/v1`). Callers only pass a path like `/vendors/overview`. Changing the backend URL, or moving between local/staging/production, is an environment change — not a code change.

It also stays a **server-only** variable. `NEXT_PUBLIC_*` values are inlined into the client bundle and read at build time; `SERVER_URL` is read at runtime and never shipped to the browser.

### 2. Auth is declarative

```ts
{ auth: "required" } // must have a token, otherwise throw
{ auth: "optional" } // attach a token if one exists
{ auth: "none" }     // public endpoint, don't even read the session
```

This is a tiny API, but it prevents a common class of bugs: accidentally calling a protected endpoint without a token, or needlessly reading cookies for public data.

### 3. Tokens never reach the browser

The file starts with `import "server-only"`, so it can only be imported from Server Components, server queries, or server actions. The bearer token is attached on the server, which means client components can trigger authenticated requests through actions without ever seeing the token.

### 4. Consistent, useful errors

Two small helpers keep error handling predictable:

- `getErrorMessage()` pulls `message` out of the API response, with a fallback like `API request failed (403).`.
- `getErrorCode()` reads a machine-readable `code` from the response body, so control flow never depends on parsing human-readable text.

Callers don't need to know the backend's response shape just to show a decent error to the user. An empty successful response is also treated as an error instead of silently returning `null` to callers that expect data.

### 5. Typed responses

`serverApiFetch<T>()` returns `T`, so each domain module can declare its own response type and get full autocompletion:

```ts
export async function getVendorOverview(): Promise<VendorOverview> {
  const response = await serverApiFetch<VendorOverviewResponse>(
    "/vendors/overview",
    { auth: "required", method: "GET" },
  );

  return response.data;
}
```

### 6. Cross-cutting concerns live in one place

Because every request funnels through here, app-wide behavior is a one-time change:

- Auth/status handling is centralized: `401` goes to `/unauthorized`, generic `403` goes to `/forbidden`, and `403` + `ACCOUNT_BLOCKED` goes to sign-in with a blocked reason.
- Logging, retries, timeouts, or cache tags can be added once for all endpoints.
- Header handling is safe — caller headers are copied into a `Headers` object before the auth header is set, so nothing is overwritten accidentally.

### 7. Callers stay tiny

A new endpoint is usually just a few lines in a `queries.ts` or `actions.ts` file. There is no per-endpoint boilerplate for `fetch`, URL construction, status checks, or `response.json()`.

## The cool part

Every protected request funnels through the same status handling, so auth failures are consistent app-wide:

```ts
if (response.status === 401) {
  redirect("/unauthorized");
}

if (response.status === 403 && getErrorCode(payload) === "ACCOUNT_BLOCKED") {
  redirect("/sign-in?reason=blocked");
}

if (response.status === 403) {
  redirect("/forbidden");
}
```

That is a handful of checks in one file, but it covers the whole application:

- `401` → custom **Unauthorized** page
- generic `403` → custom **Forbidden** page
- blocked account → sign-in with an explanation

This also works with `unstable_rethrow()` in the surrounding `catch` blocks (see [Understanding `redirect()` and `unstable_rethrow()`](unstable-rethrow.md)), so a framework redirect is never swallowed by application error handling. The proxy has to agree with these redirects for blocked users, which is covered in [Blocked users and the proxy](blocking-and-proxy.md).

## Trade-off to remember

This client is deliberately **server-only**. Browser code should call a server action instead of trying to import `serverApiFetch`. That is a feature: it keeps tokens, the backend URL, and auth decisions on the server where they belong.
