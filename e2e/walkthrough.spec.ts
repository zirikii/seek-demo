import { test, expect } from "@playwright/test";
import {
  beat,
  dismissOverlays,
  goTo,
  installCursor,
  pointAndClick,
  safe,
  typeInto,
} from "./helpers";

/**
 * "Computer-vision" walkthrough: drives the real running app through the full
 * candidate journey while Playwright records the screen to video (see
 * playwright.config.ts -> use.video). A visible cursor + click ripples make the
 * recording read like a guided product demo.
 *
 * Steps are wrapped in `safe()` so a single flaky selector never aborts the
 * recording — the deliverable is a complete demo video.
 *
 * Run against a running server:
 *   PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test
 */
test("SEEK demo — full candidate walkthrough", async ({ page }) => {
  test.setTimeout(220_000);
  await installCursor(page);

  // 1) Marketing landing -------------------------------------------------------
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Australia's no\. 1 jobs site/i })).toBeVisible();
  await beat(page, 1200);

  await safe("hero search", async () => {
    await typeInto(page, page.getByPlaceholder("Enter keywords"), "Software Engineer");
    await typeInto(page, page.getByPlaceholder("Enter suburb, city, or region"), "Sydney NSW");
    await beat(page, 600);
  });

  // Scroll to show employer grid + career advice, then back to top.
  await page.mouse.wheel(0, 700);
  await beat(page, 1000);
  await page.mouse.wheel(0, 700);
  await beat(page, 1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await beat(page, 800);

  // 2) Sign in -----------------------------------------------------------------
  await safe("go to login", async () => {
    await pointAndClick(page, page.getByRole("link", { name: "Sign in" }).first());
  });
  await expect(page.getByRole("heading", { name: /Sign in to SEEK/i })).toBeVisible();
  await beat(page, 1000);
  await pointAndClick(page, page.getByRole("button", { name: "Sign in" }), 1800);

  // 3) Dashboard ---------------------------------------------------------------
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  await beat(page, 1400);
  await page.mouse.wheel(0, 400);
  await beat(page, 1000);
  await page.evaluate(() => window.scrollTo({ top: 0 }));

  // 4) Job search split view ---------------------------------------------------
  await goTo(page, "Job search", 1600);
  await expect(page).toHaveURL(/\/jobs/);
  await beat(page, 1200);

  // Click a couple of result cards to update the Job Details View, finishing on
  // the first (featured, non-applied) card so Quick apply is available.
  const cards = page.locator("main button:has(h3)");
  await safe("select card 3", () => pointAndClick(page, cards.nth(2), 1300));
  await safe("select card 2", () => pointAndClick(page, cards.nth(1), 1300));
  await safe("select card 1", () => pointAndClick(page, cards.nth(0), 1300));

  // 5) Quick apply from the Job Details View -----------------------------------
  // The JDV lives in a sticky, nested-scroll container, which can confuse
  // Playwright's auto-scroll-before-click; dispatch the click directly instead.
  await safe("quick apply", async () => {
    const jdv = page.locator("#jdv-scroll");
    await pointAndClick(page, jdv.getByRole("button", { name: /quick apply/i }).first(), 900);
    await expect(page.getByRole("heading", { name: "Quick apply" })).toBeVisible();
    await typeInto(
      page,
      page.getByPlaceholder(/why you're a great fit/i),
      "I'm excited about this role and would love to contribute.",
    );
    await pointAndClick(page, page.getByRole("button", { name: /submit application/i }), 1500);
    await pointAndClick(page, page.getByRole("button", { name: "Done" }), 1000);
  });
  await dismissOverlays(page);

  // 6) Apply a classification filter (Radix Select — its trigger is a
  // button[role=combobox], distinct from the SearchBar's datalist input).
  await safe("apply classification filter", async () => {
    await pointAndClick(page, page.locator('button[role="combobox"]').first(), 700);
    await page
      .getByRole("option")
      .filter({ hasText: "Information & Communication" })
      .click({ timeout: 5000 });
    await beat(page, 1300);
  });
  await dismissOverlays(page);

  // 7) Save a job from the result card -----------------------------------------
  await safe("save a job", async () => {
    const firstCard = page.locator("main button:has(h3)").first();
    await pointAndClick(page, firstCard.getByRole("button", { name: /save/i }), 1400);
  });

  // 7) Saved jobs + note -------------------------------------------------------
  await goTo(page, /Saved jobs/i, 1300);
  await safe("add a note", async () => {
    const noteField = page.getByPlaceholder(/private note/i).first();
    await typeInto(page, noteField, "Follow up next week — great culture fit.");
    await pointAndClick(page, page.getByRole("button", { name: "Save note" }).first(), 1200);
  });

  // 8) Applied jobs tracker ----------------------------------------------------
  await goTo(page, /Applied jobs/i, 1400);
  await safe("view applied", async () => {
    await expect(page.getByRole("heading", { name: "Applied jobs" })).toBeVisible();
    await beat(page, 1400);
  });

  // 9) Profile builder ---------------------------------------------------------
  await goTo(page, "Profile", 1300);
  await safe("view profile", async () => {
    await expect(page.getByRole("heading", { name: "My profile" })).toBeVisible();
    await beat(page, 1000);
    await page.mouse.wheel(0, 500);
    await beat(page, 1200);
    await page.evaluate(() => window.scrollTo({ top: 0 }));
  });

  // 10) Saved searches & alerts ------------------------------------------------
  await goTo(page, /Saved searches/i, 1300);
  await safe("view saved searches", async () => {
    await expect(page.getByRole("heading", { name: /Saved searches/i })).toBeVisible();
    await beat(page, 1200);
  });

  // 11) Settings toggle --------------------------------------------------------
  await goTo(page, "Settings", 1300);
  await safe("toggle a setting", async () => {
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await beat(page, 800);
    await pointAndClick(page, page.getByRole("switch").first(), 1400);
  });

  await beat(page, 1800);
});
