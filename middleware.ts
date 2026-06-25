import { NextResponse, type NextRequest } from "next/server";
import { decodeSession } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/constants";

/** URL path prefixes that require an authenticated candidate session. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/jobs",
  "/saved-jobs",
  "/saved-searches",
  "/applied",
  "/profile",
  "/settings",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decodeSession(token);
  if (session) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/oauth/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run on everything except Next internals and static asset folders.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand|employers).*)"],
};
