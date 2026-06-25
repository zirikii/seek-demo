import type { Locator, Page } from "@playwright/test";

/**
 * Inject a fake cursor + click ripple so the recorded walkthrough video clearly
 * shows where the "user" is pointing and clicking (Playwright doesn't render the
 * real OS cursor in headless video).
 */
export async function installCursor(page: Page) {
  await page.addInitScript(() => {
    function mount() {
      if (document.getElementById("pw-cursor")) return;
      const style = document.createElement("style");
      style.textContent = `
        #pw-cursor{position:fixed;top:0;left:0;width:22px;height:22px;border-radius:50%;
          background:rgba(230,2,120,0.35);border:2px solid #E60278;box-shadow:0 0 0 2px rgba(255,255,255,0.6);
          z-index:2147483647;pointer-events:none;transform:translate(-50%,-50%);transition:width .08s,height .08s;}
        .pw-ripple{position:fixed;width:10px;height:10px;border-radius:50%;background:rgba(230,2,120,0.45);
          z-index:2147483646;pointer-events:none;transform:translate(-50%,-50%);animation:pw-r .5s ease-out forwards;}
        @keyframes pw-r{from{opacity:.7;width:10px;height:10px}to{opacity:0;width:60px;height:60px}}
      `;
      document.head.appendChild(style);
      const dot = document.createElement("div");
      dot.id = "pw-cursor";
      document.body.appendChild(dot);
      window.addEventListener(
        "mousemove",
        (e) => {
          dot.style.left = `${e.clientX}px`;
          dot.style.top = `${e.clientY}px`;
        },
        true,
      );
      window.addEventListener(
        "mousedown",
        (e) => {
          const r = document.createElement("div");
          r.className = "pw-ripple";
          r.style.left = `${e.clientX}px`;
          r.style.top = `${e.clientY}px`;
          document.body.appendChild(r);
          setTimeout(() => r.remove(), 500);
        },
        true,
      );
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount);
    } else {
      mount();
    }
  });
}

/** Smoothly move the mouse to the centre of a locator (best-effort). */
export async function moveTo(page: Page, target: Locator) {
  try {
    await target.scrollIntoViewIfNeeded({ timeout: 4000 });
  } catch {
    /* sticky/nested-scroll containers can make this flaky; ignore */
  }
  const box = await target.boundingBox().catch(() => null);
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 22 });
}

/**
 * Move to + click a locator with small pauses for a natural feel. Elements inside
 * sticky / nested-scroll containers (e.g. the JDV, the apply drawer) can make
 * Playwright's auto-scroll-before-click loop, so fall back to a direct DOM click.
 */
export async function pointAndClick(page: Page, target: Locator, settle = 500) {
  await moveTo(page, target);
  await page.waitForTimeout(220);
  try {
    await target.click({ timeout: 4000 });
  } catch {
    await target.dispatchEvent("click");
  }
  await page.waitForTimeout(settle);
}

/** Type into a field with a visible per-character cadence. */
export async function typeInto(page: Page, target: Locator, text: string) {
  await moveTo(page, target);
  await target.click();
  await target.fill("");
  await target.pressSequentially(text, { delay: 55 });
  await page.waitForTimeout(300);
}

export async function beat(page: Page, ms = 800) {
  await page.waitForTimeout(ms);
}

/**
 * Run a walkthrough step but never let a flaky selector abort the recording —
 * the goal is a complete demo video, so individual non-critical steps degrade
 * gracefully.
 */
export async function safe(label: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    console.warn(`[walkthrough] step skipped: ${label} -> ${(err as Error).message}`);
  }
}

/** Close any open dialog / select / sheet so it can't block later interactions. */
export async function dismissOverlays(page: Page) {
  for (let i = 0; i < 2; i++) {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(150);
  }
}

/** Robustly navigate via a sticky top-nav link, dismissing overlays first. */
export async function goTo(page: Page, name: RegExp | string, settle = 1300) {
  await dismissOverlays(page);
  const link = page.getByRole("link", { name }).first();
  await pointAndClick(page, link, settle);
}
