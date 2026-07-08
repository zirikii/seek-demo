"use strict";

const { chromium } = require("playwright");
const { spawn } = require("child_process");
const http = require("http");
const net = require("net");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const shotsDir = path.join(root, "shots");
const videoDir = path.join(shotsDir, "walkthrough");

const SERVER_HOST = "127.0.0.1";
const SERVER_STARTUP_TIMEOUT_MS = 15000;
const SERVER_POLL_INTERVAL_MS = 100;

function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, SERVER_HOST, () => {
      const port = server.address().port;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
    server.on("error", reject);
  });
}

function waitForServer(url, timeoutMs) {
  const started = Date.now();
  const { hostname, port } = new URL(url);

  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get(
        { hostname, port: Number(port), path: "/", timeout: 1000 },
        (res) => {
          res.resume();
          resolve();
        }
      );

      const retryOrFail = () => {
        if (Date.now() - started >= timeoutMs) {
          reject(
            new Error(
              `HTTP server did not become ready at ${url} within ${timeoutMs}ms`
            )
          );
          return;
        }
        setTimeout(tryConnect, SERVER_POLL_INTERVAL_MS);
      };

      req.on("error", retryOrFail);
      req.on("timeout", () => {
        req.destroy();
        retryOrFail();
      });
    };

    tryConnect();
  });
}

async function startServer() {
  const port = await getAvailablePort();
  const url = `http://${SERVER_HOST}:${port}`;

  return new Promise((resolve, reject) => {
    let settled = false;
    let stderr = "";

    const proc = spawn("python3", ["-m", "http.server", String(port), "--bind", SERVER_HOST], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const fail = (err) => {
      if (settled) return;
      settled = true;
      try {
        proc.kill();
      } catch {
        // Process may already be gone.
      }
      reject(err);
    };

    proc.on("error", (err) => {
      fail(new Error(`Failed to start HTTP server: ${err.message}`));
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("exit", (code, signal) => {
      if (settled) return;
      const details = stderr.trim();
      fail(
        new Error(
          `HTTP server exited before becoming ready (code ${code ?? "null"}, signal ${signal ?? "null"})${
            details ? `: ${details}` : ""
          }`
        )
      );
    });

    waitForServer(url, SERVER_STARTUP_TIMEOUT_MS)
      .then(() => {
        if (settled) return;
        if (proc.exitCode !== null) {
          const details = stderr.trim();
          fail(
            new Error(
              `HTTP server exited before becoming ready (code ${proc.exitCode})${
                details ? `: ${details}` : ""
              }`
            )
          );
          return;
        }
        settled = true;
        resolve({ proc, url });
      })
      .catch(fail);
  });
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function runWalkthrough() {
  fs.mkdirSync(videoDir, { recursive: true });

  const { proc, url } = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: videoDir, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  try {
    console.log("Starting walkthrough at", url);

    // Home page + mega menu
    await page.goto(url + "/index.html");
    await page.waitForLoadState("networkidle");
    await pause(page, 1200);
    await page.locator('.main-nav__item[data-menu="bank"] .main-nav__btn').hover();
    await pause(page, 1000);
    await page.locator('#mega-bank a[href="savings-accounts.html"]').first().click();
    await page.waitForLoadState("networkidle");
    await pause(page, 1200);

    // Credit cards hub
    await page.goto(url + "/credit-cards.html");
    await pause(page, 1200);
    await page.locator('.main-nav__item[data-menu="cards"] .main-nav__btn').hover();
    await pause(page, 800);
    await page.goto(url + "/latest-offers.html");
    await pause(page, 1000);

    // Home loans + refinancing
    await page.goto(url + "/home-loans.html");
    await pause(page, 1200);
    await page.goto(url + "/refinancing.html");
    await pause(page, 1200);

    // Business section
    await page.goto(url + "/business.html");
    await pause(page, 1200);
    await page.goto(url + "/business-accounts.html");
    await pause(page, 1000);

    // Corporate + insurance
    await page.goto(url + "/corporate.html");
    await pause(page, 1000);
    await page.goto(url + "/insurance.html");
    await pause(page, 1000);
    await page.goto(url + "/travel-insurance.html");
    await pause(page, 1000);

    // Help, contact, find us
    await page.goto(url + "/help-support.html");
    await pause(page, 1000);
    await page.goto(url + "/contact-us.html");
    await pause(page, 1000);
    await page.goto(url + "/find-us.html");
    await pause(page, 1000);

    // Home page interactions: search, login, accordion
    await page.goto(url + "/index.html");
    await pause(page, 800);
    await page.locator("#searchToggle").click();
    await pause(page, 800);
    await page.keyboard.press("Escape");
    await pause(page, 400);
    await page.locator("#loginToggle").click();
    await pause(page, 800);
    await page.keyboard.press("Escape");
    await pause(page, 400);
    await page.locator(".accordion__btn").first().click();
    await pause(page, 800);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
    await pause(page, 600);

    // Mobile menu
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url + "/index.html");
    await pause(page, 800);
    await page.locator("#hamburger").click();
    await pause(page, 1000);
    await page.locator(".mobile-acc__btn").first().click();
    await pause(page, 800);
    await page.locator("#mobileMenuClose").click();
    await pause(page, 600);

    // Sitemap + legal
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url + "/sitemap.html");
    await pause(page, 1200);
    await page.goto(url + "/privacy.html");
    await pause(page, 1000);
    await page.goto(url + "/international.html");
    await pause(page, 1000);

    await page.screenshot({ path: path.join(shotsDir, "walkthrough-final.png"), fullPage: false });
    console.log("Walkthrough complete.");
  } finally {
    await context.close();
    await browser.close();
    proc.kill();

    const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
    if (videos.length) {
      const src = path.join(videoDir, videos[videos.length - 1]);
      const dest = path.join(shotsDir, "walkthrough-demo.webm");
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      fs.renameSync(src, dest);
      console.log("Video saved to:", dest);

      try {
        const { execSync } = require("child_process");
        execSync(
          `ffmpeg -y -i "${dest}" -c:v libx264 -pix_fmt yuv420p "${path.join(shotsDir, "walkthrough-demo.mp4")}"`,
          { stdio: "pipe" }
        );
        console.log("MP4 saved to:", path.join(shotsDir, "walkthrough-demo.mp4"));
      } catch {
        console.log("ffmpeg not available; webm video retained.");
      }
    }
  }
}

runWalkthrough().catch((err) => {
  console.error(err);
  process.exit(1);
});
