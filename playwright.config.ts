import { defineConfig, devices } from "@playwright/test";

// QA harness for the static-export branch. The site is tested the way it ships
// on Hostinger's shared plan: `next build` writes `out/`, and a plain static
// file server does the routing. `127.0.0.1` rather than `localhost` because the
// `serve` package binds IPv4 only on this machine and `localhost` resolves to
// ::1 first.
const PORT = 4321;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 4,
  reporter: [["list"]],
  timeout: 60_000,
  expect: { timeout: 10_000 },
  outputDir: "test-results",

  use: {
    baseURL: BASE_URL,
    trace: "off",
    video: "off",
    screenshot: "off",
  },

  webServer: {
    command: `npx serve out -l ${PORT} --no-clipboard`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },

  projects: [
    {
      name: "mobile",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    {
      name: "wide",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1600, height: 1000 } },
    },
  ],
});
