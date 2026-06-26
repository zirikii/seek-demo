import { NextResponse } from "next/server";
import {
  addSavedSearch,
  getSavedSearches,
  removeSavedSearch,
  updateSavedSearch,
} from "@/lib/data/searches";
import { createSearchSchema, updateSearchSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/server";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const searches = await getSavedSearches();
  return NextResponse.json({ searches });
}

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = createSearchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const search = await addSavedSearch(parsed.data);
  return NextResponse.json({ search });
}

export async function PUT(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = updateSearchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { id, ...patch } = parsed.data;
  const searches = await updateSavedSearch(id, patch);
  return NextResponse.json({ searches });
}

export async function DELETE(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const searches = await removeSavedSearch(id);
  return NextResponse.json({ searches });
}
