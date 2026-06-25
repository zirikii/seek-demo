import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/data/profile";
import { getSession } from "@/lib/auth/server";
import type { Profile } from "@/lib/types";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const profile = await getProfile();
  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<Profile> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const profile = await updateProfile(body);
  return NextResponse.json({ profile });
}
