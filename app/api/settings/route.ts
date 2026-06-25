import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/data/settings";
import { getSession } from "@/lib/auth/server";
import type { Settings } from "@/lib/types";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<Settings> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const settings = await updateSettings(body);
  return NextResponse.json({ settings });
}
