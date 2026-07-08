import { describe, expect, it } from "vitest";
import { computeProfileStrength } from "../profile";
import type { Profile } from "@/lib/types";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    userId: "user_1",
    personal: {
      firstName: "Alex",
      lastName: "Taylor",
      email: "alex@example.com",
      phone: "0400 000 000",
      location: "Sydney NSW",
      headline: "Engineer",
      summary: "A reasonably detailed career summary that exceeds the threshold length.",
    },
    careerHistory: [
      {
        id: "ch_1",
        title: "Engineer",
        company: "Acme",
        location: "Sydney",
        startDate: "2020",
        endDate: "Present",
        description: "Did things",
      },
    ],
    education: [{ id: "ed_1", qualification: "BCS", institution: "Uni", completed: "2018" }],
    skills: ["React", "TypeScript", "Node"],
    licences: [{ id: "lic_1", name: "WWCC", detail: "Verified" }],
    preferences: {
      workTypes: ["Full time"],
      locations: ["Sydney NSW"],
      salaryExpectation: 150000,
      classification: "Information & Communication Technology",
      openToWork: true,
    },
    ...overrides,
  };
}

describe("computeProfileStrength", () => {
  it("scores a complete profile as 100% all-star", () => {
    const result = computeProfileStrength(makeProfile());
    expect(result.score).toBe(100);
    expect(result.label).toBe("All star");
  });

  it("reduces the score for missing sections", () => {
    const result = computeProfileStrength(makeProfile({ skills: [], education: [] }));
    expect(result.score).toBeLessThan(100);
    expect(result.completed.find((c) => c.key === "skills")?.done).toBe(false);
  });

  it("labels an empty-ish profile as getting started", () => {
    const result = computeProfileStrength(
      makeProfile({
        personal: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          headline: "",
          summary: "",
        },
        careerHistory: [],
        education: [],
        skills: [],
        licences: [],
        preferences: {
          workTypes: [],
          locations: [],
          salaryExpectation: 0,
          classification: "",
          openToWork: false,
        },
      }),
    );
    expect(result.score).toBe(0);
    expect(result.label).toBe("Getting started");
  });
});
