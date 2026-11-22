# Understanding `redirect()` and `unstable_rethrow()` in Next.js

## 1. How `redirect()` works

In Next.js, `redirect()` does not return a value like a normal function. Instead, it throws a special internal error (`NEXT_REDIRECT`) to tell Next.js to stop the current execution and redirect the user to another route.

```ts
import { redirect } from "next/navigation";

redirect("/sign-in");
```

Next.js uses this internal error mechanism to handle the redirect.

## 2. Why `try/catch` can prevent a redirect

A `try/catch` block catches errors, including the internal error thrown by `redirect()`.

If `serverApiFetch()` calls `redirect("/sign-in")` but it is invoked inside a `try/catch`, the `catch` block may swallow the redirect signal. As a result, the redirect won't happen, and the application may return an error state instead.

```ts
try {
  await serverApiFetch("/profile");
} catch (error) {
  return { ok: false };
}
```

## 3. What is `unstable_rethrow()`?

`unstable_rethrow()` is a Next.js utility that rethrows framework-specific internal errors, such as redirects and `notFound()`, so Next.js can handle them properly instead of treating them as regular application errors.

```ts
import { unstable_rethrow } from "next/navigation";

try {
  const data = await serverApiFetch("/profile");
  return data;
} catch (error) {
  unstable_rethrow(error);

  // Handle ordinary application errors
  return { ok: false, message: "Something went wrong" };
}
```

## 4. How it works

- **Next.js internal errors:** `unstable_rethrow(error)` rethrows them, allowing Next.js to handle redirects, `notFound()`, and other framework control-flow signals.
- **Ordinary errors:** They continue through your `catch` block, allowing you to handle API failures, network errors, and display custom error states.

## 5. When should I use it?

Use `unstable_rethrow(error)` inside a `catch` block when the code inside the corresponding `try` can trigger Next.js framework control flow, such as `redirect()` or `notFound()`.

You don't need it in every `catch` block. If the code inside `try` cannot trigger such framework control flow, it is unnecessary.

## Real example in this project

`lib/server-api.ts` redirects blocked accounts from the shared API client:

```ts
if (response.status === 403 && getErrorCode(payload) === "ACCOUNT_BLOCKED") {
  redirect("/sign-in?reason=blocked");
}
```

That `redirect()` can be reached from server components and server actions that wrap their API calls in `try/catch`. Without `unstable_rethrow(error)` at the top of those catch blocks, the redirect would be swallowed and the user would see a generic error state instead of being sent to the sign-in page.

## Key takeaway

`redirect()` works through a thrown internal signal. A `try/catch` can accidentally catch that signal and prevent the redirect. `unstable_rethrow()` ensures Next.js internal errors are not swallowed while allowing you to handle ordinary errors normally.
