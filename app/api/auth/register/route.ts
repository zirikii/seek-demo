import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerSchema } from "@/lib/validation";
import { encodeSession } from "@/lib/auth/session";
import { sessionCookieOptions } from "@/lib/auth/cookie";
import { createUser } from "@/lib/data/users";

/** Register a new candidate (persists to data/users.json) and auto-logs in. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;
  const user = await createUser({ name, email, password });
  const sessionUser = { id: user.id, email: user.email, name: user.name };

  const token = await encodeSession(sessionUser);
  const store = await cookies();
  store.set({ ...sessionCookieOptions, value: token });

  return NextResponse.json({ user: sessionUser });
}
