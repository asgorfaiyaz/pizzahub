# Blocked users and the proxy

The proxy (Next.js 16's replacement for middleware) runs **before** page/server-component guards. That matters for blocked accounts.

## The problem

A blocked user still has a valid better-auth session, so this proxy rule fires:

```ts
if (isAuthRoute && session) {
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
```

Flow:

1. Server guard redirects the blocked user to `/sign-in?reason=blocked`.
2. Proxy sees `session` and redirects `/sign-in` → `/dashboard`.
3. Dashboard guard redirects back to `/sign-in?reason=blocked`.
4. Loop.

## The fix

Make the proxy block-aware before the auth-route check:

```ts
const session = await auth.api.getSession({ headers: request.headers });
const isBlocked = Boolean(session?.user.isBlocked);

if (isBlocked) {
  if (isAuthRoute) return NextResponse.next();

  const url = new URL("/sign-in", request.url);
  url.searchParams.set("reason", "blocked");
  return NextResponse.redirect(url);
}
```

- Blocked users can **stay** on `/sign-in` and read the "account blocked" notice.
- Blocked users are redirected to `/sign-in?reason=blocked` from any protected route.
- Public routes still return early, so browsing the menu stays open.

## Takeaway

When an edge-level proxy and server-level guards both handle auth, they must agree on blocked accounts. Otherwise the proxy's "signed-in users shouldn't see sign-in" rule fights the server's "blocked users must see sign-in" rule and creates a redirect loop.
