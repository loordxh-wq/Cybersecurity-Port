import { defineConfig } from "@playwright/test";

/**
 * End-to-end suite: every page in English, Hebrew and Arabic at desktop, tablet and
 * two phone widths, plus navigation, the certificate viewer, the home chapters,
 * motion and reduced-motion behaviour. Runs against a production build:
 *   npm run build && npm run test:e2e
 * Set E2E_BASE_URL to test an already running server instead.
 */
const port = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // The hero renders WebGL in software on GPU-less machines; more parallel browsers starve the CPU.
  workers: 2,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    // WebGL in headless Chromium without a GPU (software renderer).
    launchOptions: { args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"] },
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npx next start -p ${port}`,
        url: `${baseURL}/en`,
        reuseExistingServer: true,
        timeout: 60_000,
        env: { NEXT_TELEMETRY_DISABLED: "1" },
      },
});
