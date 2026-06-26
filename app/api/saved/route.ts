import { NextResponse } from "next/server";
import { addSavedJob, getSavedJobs, removeSavedJob, updateSavedNote } from "@/lib/data/saved";
import { saveJobSchema, saveNoteSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/server";

async function ensureAuthed() {
  const session = await getSession();
  return session;
}

export async function GET() {
  if (!(await ensureAuthed())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const saved = await getSavedJobs();
  return NextResponse.json({ saved });
}

export async function POST(request: Request) {
  if (!(await ensureAuthed())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = saveJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const saved = await addSavedJob(parsed.data.jobId);
  return NextResponse.json({ saved });
}

export async function PATCH(request: Request) {
  if (!(await ensureAuthed())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = saveNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const saved = await updateSavedNote(parsed.data.jobId, parsed.data.note);
  return NextResponse.json({ saved });
}

export async function DELETE(request: Request) {
  if (!(await ensureAuthed())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
  }
  const saved = await removeSavedJob(jobId);
  return NextResponse.json({ saved });
}
