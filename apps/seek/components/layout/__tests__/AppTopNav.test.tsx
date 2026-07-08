import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppTopNav } from "../AppTopNav";
import { AppDataProvider } from "@/components/providers/AppDataProvider";

// next/navigation is mocked in vitest.setup.ts with usePathname() => "/dashboard".

const user = { id: "user_1", email: "candidate@example.com", name: "Alex Taylor" };

function renderNav() {
  return render(
    <AppDataProvider initialSavedIds={["job_1", "job_2"]} initialAppliedIds={["job_3"]}>
      <AppTopNav user={user} />
    </AppDataProvider>,
  );
}

describe("AppTopNav active state", () => {
  it("marks the current route as active", () => {
    renderNav();
    const dashboardLinks = screen.getAllByRole("link", { name: /dashboard/i });
    const activeDashboard = dashboardLinks.find(
      (el) => el.getAttribute("aria-current") === "page",
    );
    expect(activeDashboard).toBeTruthy();
  });

  it("does not mark other routes as active", () => {
    renderNav();
    const jobLinks = screen.getAllByRole("link", { name: /job search/i });
    jobLinks.forEach((el) => {
      expect(el.getAttribute("aria-current")).not.toBe("page");
    });
  });

  it("renders saved/applied count badges from context", () => {
    renderNav();
    // savedCount = 2, appliedCount = 1 -> both badges present at least once.
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });
});
