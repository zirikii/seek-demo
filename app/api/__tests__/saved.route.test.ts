import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock auth + data layer so the route test never touches disk or cookies.
vi.mock("@/lib/auth/server", () => ({
  getSession: vi.fn(),
}));
vi.mock("@/lib/data/saved", () => ({
  addSavedJob: vi.fn(),
  getSavedJobs: vi.fn(),
  removeSavedJob: vi.fn(),
  updateSavedNote: vi.fn(),
}));

import { POST } from "@/app/api/saved/route";
import { getSession } from "@/lib/auth/server";
import { addSavedJob } from "@/lib/data/saved";

const mockedGetSession = vi.mocked(getSession);
const mockedAddSavedJob = vi.mocked(addSavedJob);

function postRequest(body: unknown) {
  return new Request("http://localhost/api/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/saved", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated requests with 401", async () => {
    mockedGetSession.mockResolvedValue(null);
    const res = await POST(postRequest({ jobId: "job_1" }));
    expect(res.status).toBe(401);
    expect(mockedAddSavedJob).not.toHaveBeenCalled();
  });

  it("saves a job for an authenticated user", async () => {
    mockedGetSession.mockResolvedValue({ id: "u1", email: "a@b.com", name: "A" });
    mockedAddSavedJob.mockResolvedValue([{ jobId: "job_1", savedAt: "now", note: "" }]);

    const res = await POST(postRequest({ jobId: "job_1" }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(mockedAddSavedJob).toHaveBeenCalledWith("job_1");
    expect(data.saved).toHaveLength(1);
  });

  it("validates the request body", async () => {
    mockedGetSession.mockResolvedValue({ id: "u1", email: "a@b.com", name: "A" });
    const res = await POST(postRequest({ notJobId: true }));
    expect(res.status).toBe(400);
  });
});
