import { describe, expect, it } from "vitest";
import { countActiveFilters, filterJobs, similarJobs } from "../filters";
import type { Employer, JobWithEmployer } from "@/lib/types";

const employer: Employer = {
  id: "emp_1",
  slug: "acme",
  name: "Acme",
  logo: "/employers/acme.svg",
  industry: "ICT",
  tagline: "",
  about: "",
  location: "Sydney NSW",
  size: "100+",
  rating: 4,
  reviewCount: 10,
};

function makeJob(overrides: Partial<JobWithEmployer> = {}): JobWithEmployer {
  return {
    id: "job_1",
    title: "Software Engineer",
    employerId: "emp_1",
    location: { area: "CBD", city: "Sydney", state: "NSW" },
    workType: "Full time",
    classification: "Information & Communication Technology",
    subClassification: "Developers/Programmers",
    salary: { min: 120000, max: 140000, period: "year" },
    teaser: "Build great software",
    bullets: ["Hybrid"],
    description: "desc",
    postedAt: new Date("2026-06-20T00:00:00Z").toISOString(),
    featured: false,
    employer,
    ...overrides,
  };
}

const now = new Date("2026-06-25T00:00:00Z").getTime();

describe("filterJobs", () => {
  const jobs: JobWithEmployer[] = [
    makeJob({ id: "a", title: "Software Engineer", location: { city: "Sydney", state: "NSW" } }),
    makeJob({
      id: "b",
      title: "Registered Nurse",
      classification: "Healthcare & Medical",
      subClassification: "Nursing",
      teaser: "Compassionate care role",
      location: { city: "Melbourne", state: "VIC" },
      salary: { min: 80000, max: 90000, period: "year" },
    }),
    makeJob({
      id: "c",
      title: "Senior Software Engineer",
      workType: "Contract/Temp",
      location: { city: "Brisbane", state: "QLD" },
    }),
  ];

  it("matches keywords across title", () => {
    const res = filterJobs(jobs, { keywords: "software" }, now);
    expect(res.map((j) => j.id).sort()).toEqual(["a", "c"]);
  });

  it("filters by location token", () => {
    const res = filterJobs(jobs, { location: "Melbourne" }, now);
    expect(res.map((j) => j.id)).toEqual(["b"]);
  });

  it("filters by classification", () => {
    const res = filterJobs(jobs, { classification: "Healthcare & Medical" }, now);
    expect(res.map((j) => j.id)).toEqual(["b"]);
  });

  it("filters by work type", () => {
    const res = filterJobs(jobs, { workType: "Contract/Temp" }, now);
    expect(res.map((j) => j.id)).toEqual(["c"]);
  });

  it("filters by minimum salary", () => {
    const res = filterJobs(jobs, { salaryMin: 100000 }, now);
    expect(res.map((j) => j.id).sort()).toEqual(["a", "c"]);
  });

  it("returns all jobs for an empty query", () => {
    expect(filterJobs(jobs, {}, now)).toHaveLength(3);
  });

  it("sorts featured first in relevance mode", () => {
    const featured = makeJob({ id: "f", featured: true });
    const res = filterJobs([...jobs, featured], { sort: "relevance" }, now);
    expect(res[0]?.id).toBe("f");
  });
});

describe("countActiveFilters", () => {
  it("counts non-default filters", () => {
    expect(countActiveFilters({})).toBe(0);
    expect(
      countActiveFilters({ classification: "ICT", workType: "Full time", salaryMin: 100000 }),
    ).toBe(3);
    expect(countActiveFilters({ dateListed: "any" })).toBe(0);
  });
});

describe("similarJobs", () => {
  it("returns same-classification jobs excluding the current one", () => {
    const base = makeJob({ id: "x" });
    const same = makeJob({ id: "y" });
    const other = makeJob({ id: "z", classification: "Healthcare & Medical" });
    const res = similarJobs([base, same, other], base);
    expect(res.map((j) => j.id)).toEqual(["y"]);
  });
});
