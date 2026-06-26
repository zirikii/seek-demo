import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validation";
import { encodeSession } from "@/lib/auth/session";
import { sessionCookieOptions } from "@/lib/auth/cookie";
import { getUserByEmail } from "@/lib/data/users";
import { createId } from "@/lib/data/store";

/**
 * Demo login: ANY email/password is accepted (demo mode).
 * If the email matches a seeded/registered user we reuse their identity,
 * otherwise we mint an ephemeral session for the supplied email.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { email } = parsed.data;
  const existing = await getUserByEmail(email);
  const sessionUser = existing
    ? { id: existing.id, email: existing.email, name: existing.name }
    : { id: createId("user"), email, name: email.split("@")[0] ?? "Candidate" };

  const token = await encodeSession(sessionUser);
  const store = await cookies();
  store.set({ ...sessionCookieOptions, value: token });

  return NextResponse.json({ user: sessionUser });
}
