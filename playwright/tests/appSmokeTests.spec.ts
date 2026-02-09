import { APP_SMOKE_DATA, getVersionFromBaseUrl, resolveAppUrl } from "@data/appSmokeTestData";
import { LOCATORS } from "@data/commonLocators";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

const APP_LOAD_TIMEOUT = 30_000;
const baseUrl = process.env.BASE_URL || "";
const version = getVersionFromBaseUrl(baseUrl);
const apps = APP_SMOKE_DATA[version] || [];

test.describe("App smoke tests", () => {
  for (const app of apps) {
    test(`TC: APP_SMOKE - ${app.name} app loads configuration #e2e`, async ({ page }) => {
      // Arrange
      const appUrl = resolveAppUrl(version, app.id);

      // Act
      await page.goto(appUrl);
      const appFrame = page.locator('[data-test-id="app-frame"]');

      await expect(appFrame).toBeVisible({ timeout: APP_LOAD_TIMEOUT });

      // Assert - app-specific config content loaded in iframe
      const iframeLocator = page.frameLocator('[data-test-id="app-frame"]');

      await expect(iframeLocator.getByText(app.expectedText).first()).toBeVisible({
        timeout: APP_LOAD_TIMEOUT,
      });

      // Assert - no dashboard error notifications
      await expect(page.locator(LOCATORS.errorBanner)).not.toBeVisible();
    });
  }
});
