import { APP_SMOKE_DATA, getVersionFromBaseUrl, resolveAppUrl } from "@data/appSmokeTestData";
import { LOCATORS } from "@data/commonLocators";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

const APP_LOAD_TIMEOUT = 30_000;
const baseUrl = process.env.BASE_URL || "";
const version = getVersionFromBaseUrl(baseUrl);
const apps = APP_SMOKE_DATA[version] || [];

console.log(`App smoke tests: resolved version "${version}" from BASE_URL "${baseUrl}"`);

if (!version || apps.length === 0) {
  console.warn(
    `App smoke tests: no test data for version "${version}". ` +
      `Supported versions: ${Object.keys(APP_SMOKE_DATA).join(", ")}. Tests will not run.`,
  );
}

apps.forEach(app => {
  test(`TC: APP_SMOKE - [${version}] ${app.name} app renders and loads configuration #e2e`, async ({
    page,
  }) => {
    const appUrl = resolveAppUrl(version, app.id);

    await page.goto(appUrl);
    const appFrame = page.locator('[data-test-id="app-frame"]');

    await expect(appFrame).toBeVisible({ timeout: APP_LOAD_TIMEOUT });

    const iframeLocator = page.frameLocator('[data-test-id="app-frame"]');

    await expect(iframeLocator.getByText(app.heading).first()).toBeVisible({
      timeout: APP_LOAD_TIMEOUT,
    });

    await app.assertContent(iframeLocator, APP_LOAD_TIMEOUT);

    await expect(page.locator(LOCATORS.errorBanner)).not.toBeVisible();
  });
});
