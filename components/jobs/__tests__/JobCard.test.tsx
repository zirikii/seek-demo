import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { JobCard } from "../JobCard";
import { AppDataProvider } from "@/components/providers/AppDataProvider";
import type { Employer, JobWithEmployer } from "@/lib/types";

const employer: Employer = {
  id: "emp_1",
  slug: "acme",
  name: "Acme Corp",
  logo: "/employers/acme.svg",
  industry: "ICT",
  tagline: "",
  about: "",
  location: "Sydney NSW",
  size: "100+",
  rating: 4,
  reviewCount: 10,
};

const job: JobWithEmployer = {
  id: "job_1",
  title: "Senior Software Engineer",
  employerId: "emp_1",
  location: { area: "CBD", city: "Sydney", state: "NSW" },
  workType: "Full time",
  classification: "Information & Communication Technology",
  subClassification: "Developers/Programmers",
  salary: { min: 140000, max: 170000, period: "year", display: "$140,000 – $170,000" },
  teaser: "Build delightful products",
  bullets: ["Hybrid working", "Equity", "Learning budget"],
  description: "desc",
  postedAt: new Date().toISOString(),
  featured: true,
  employer,
};

function renderCard(saved: string[] = [], applied: string[] = []) {
  return render(
    <AppDataProvider initialSavedIds={saved} initialAppliedIds={applied}>
      <JobCard job={job} />
    </AppDataProvider>,
  );
}

describe("JobCard", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }) as never;
  });

  it("renders title, employer, salary and badges", () => {
    renderCard();
    expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("$140,000 – $170,000")).toBeInTheDocument();
    expect(screen.getByText("Full time")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("toggles save state and calls the API", async () => {
    renderCard();
    const saveBtn = screen.getByRole("button", { name: /save Senior Software Engineer/i });
    expect(saveBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/saved",
        expect.objectContaining({ method: "POST" }),
      );
    });
    expect(screen.getByRole("button", { name: /remove Senior Software Engineer/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows an Applied badge when the job has been applied to", () => {
    renderCard([], ["job_1"]);
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });
});
