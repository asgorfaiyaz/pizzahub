import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const publicRoutes = [
  "/",
  "/browse-menu",
  "/unauthorized",
  "/forbidden",
];
const authRoutes = ["/sign-in", "/sign-up"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some((route) =>
    matchesRoute(pathname, route),
  );
  const isAuthRoute = authRoutes.some((route) => matchesRoute(pathname, route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const isBlocked = Boolean(session?.user.isBlocked);

  if (isBlocked) {
    // Let blocked users stay on the sign-in page so they can see why they
    // were redirected instead of bouncing back to the dashboard.
    if (isAuthRoute) {
      return NextResponse.next();
    }

    const blockedUrl = new URL("/sign-in", request.url);
    blockedUrl.searchParams.set("reason", "blocked");
    return NextResponse.redirect(blockedUrl);
  }

  if (!isAuthRoute && !session) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
