import { NextResponse } from "next/server";
import { addApplication, getApplications } from "@/lib/data/applications";
import { removeSavedJob } from "@/lib/data/saved";
import { applySchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/server";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const applications = await getApplications();
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const application = await addApplication(parsed.data);
  // Applying removes the job from the saved list (it moves into "Applied").
  await removeSavedJob(parsed.data.jobId);
  return NextResponse.json({ application });
}
