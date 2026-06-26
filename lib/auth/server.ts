import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/lib/types";
import { SESSION_COOKIE } from "@/lib/constants";
import { decodeSession } from "./session";

/** Read and verify the current session from the request cookies (server-side). */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}

/**
 * Require an authenticated session in a server component / route handler.
 * Redirects to login when there is no valid session.
 */
export async function requireSession(redirectTo = "/dashboard"): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect(`/oauth/login?redirect=${encodeURIComponent(redirectTo)}`);
  }
  return session;
}
