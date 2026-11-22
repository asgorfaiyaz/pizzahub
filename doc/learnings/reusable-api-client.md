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

A small `getErrorMessage()` helper pulls `message` out of the API response, with a fallback like `API request failed (403).`. Callers don't need to know the backend's response shape just to show a decent error to the user.

An empty successful response is also treated as an error instead of silently returning `null` to callers that expect data.

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

- Structured error codes such as `ACCOUNT_BLOCKED` can trigger a global redirect.
- Logging, retries, timeouts, or cache tags can be added once for all endpoints.
- Header handling is safe — caller headers are copied into a `Headers` object before the auth header is set, so nothing is overwritten accidentally.

### 7. Callers stay tiny

A new endpoint is usually just a few lines in a `queries.ts` or `actions.ts` file. There is no per-endpoint boilerplate for `fetch`, URL construction, status checks, or `response.json()`.

## The cool part

A single `403` from any protected endpoint can now do the right thing everywhere:

```ts
if (response.status === 403 && getErrorCode(payload) === "ACCOUNT_BLOCKED") {
  redirect("/sign-in?reason=blocked");
}
```

That is one check in one file, but it covers the whole application. Paired with `unstable_rethrow()` in the surrounding `catch` blocks (see [Understanding `redirect()` and `unstable_rethrow()`](unstable-rethrow.md)), blocked users are consistently sent to sign-in instead of seeing random error states.

## Trade-off to remember

This client is deliberately **server-only**. Browser code should call a server action instead of trying to import `serverApiFetch`. That is a feature: it keeps tokens, the backend URL, and auth decisions on the server where they belong.
