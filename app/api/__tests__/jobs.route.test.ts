import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/jobs/route";

describe("GET /api/jobs", () => {
  it("returns the seeded jobs", async () => {
    const res = await GET(new Request("http://localhost/api/jobs"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.count).toBeGreaterThan(20);
    expect(Array.isArray(data.jobs)).toBe(true);
    // Each job is enriched with its employer.
    expect(data.jobs[0]).toHaveProperty("employer.name");
  });

  it("filters by keywords", async () => {
    const res = await GET(new Request("http://localhost/api/jobs?keywords=nurse"));
    const data = await res.json();
    expect(data.count).toBeGreaterThan(0);
    for (const job of data.jobs) {
      const haystack = `${job.title} ${job.classification} ${job.teaser}`.toLowerCase();
      expect(haystack).toContain("nurse");
    }
  });

  it("filters by classification", async () => {
    const res = await GET(
      new Request(
        "http://localhost/api/jobs?classification=" +
          encodeURIComponent("Information & Communication Technology"),
      ),
    );
    const data = await res.json();
    expect(data.count).toBeGreaterThan(0);
    for (const job of data.jobs) {
      expect(job.classification).toBe("Information & Communication Technology");
    }
  });
});
