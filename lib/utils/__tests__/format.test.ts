import { describe, expect, it } from "vitest";
import {
  annualisedMin,
  formatAud,
  formatLocation,
  formatPostedAt,
  formatSalary,
  pluralise,
} from "../format";
import type { Salary } from "@/lib/types";

describe("formatAud", () => {
  it("formats whole-dollar amounts", () => {
    expect(formatAud(120000)).toBe("$120,000");
    expect(formatAud(0)).toBe("$0");
  });
});

describe("formatSalary", () => {
  it("prefers an explicit display string", () => {
    const salary: Salary = { min: 120000, max: 140000, period: "year", display: "$120k – $140k" };
    expect(formatSalary(salary)).toBe("$120k – $140k");
  });

  it("formats an annual range", () => {
    expect(formatSalary({ min: 80000, max: 95000, period: "year" })).toBe("$80,000 – $95,000");
  });

  it("formats an hourly range", () => {
    expect(formatSalary({ min: 32, max: 38, period: "hour" })).toBe("$32 – $38 per hour");
  });

  it("collapses equal min/max", () => {
    expect(formatSalary({ min: 100000, max: 100000, period: "year" })).toBe("$100,000");
  });
});

describe("annualisedMin", () => {
  it("annualises hourly rates", () => {
    expect(annualisedMin({ min: 50, max: 60, period: "hour" })).toBe(50 * 38 * 52);
  });

  it("returns annual minimums unchanged", () => {
    expect(annualisedMin({ min: 90000, max: 100000, period: "year" })).toBe(90000);
  });
});

describe("formatPostedAt", () => {
  const now = new Date("2026-06-25T12:00:00Z").getTime();

  it("labels today", () => {
    expect(formatPostedAt("2026-06-25T06:00:00Z", now)).toBe("Posted today");
  });

  it("labels recent days", () => {
    expect(formatPostedAt("2026-06-22T12:00:00Z", now)).toBe("Posted 3d ago");
  });

  it("caps at 30+ days", () => {
    expect(formatPostedAt("2026-01-01T12:00:00Z", now)).toBe("Posted 30+ days ago");
  });
});

describe("formatLocation", () => {
  it("includes the area when present", () => {
    expect(formatLocation({ area: "CBD", city: "Sydney", state: "NSW" })).toBe("CBD, Sydney NSW");
  });

  it("omits a redundant area", () => {
    expect(formatLocation({ area: "Sydney", city: "Sydney", state: "NSW" })).toBe("Sydney NSW");
  });
});

describe("pluralise", () => {
  it("handles singular and plural", () => {
    expect(pluralise(1, "job")).toBe("1 job");
    expect(pluralise(3, "job")).toBe("3 jobs");
  });
});
