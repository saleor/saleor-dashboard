import { ExtensionsPage } from "@pages/extensionsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "plugin" });

let mainMenuPage: MainMenuPage;
let extensionsPage: ExtensionsPage;

const expectedExtensions = [
  "Admin emails",
  "Adyen",
  "Avalara",
  "Dummy",
  "OpenID Connect",
  "Stripe",
  "User emails",
  "Webhooks",
];

test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  extensionsPage = new ExtensionsPage(page);

  // TODO: Remove this once removed feature flag
  await page.goto("/"); // Navigate to root to set localStorage on correct origin
  await page.evaluate(() => {
    localStorage.setItem("FF_extensions_dev", '{"enabled":true,"payload":"default"}');
  });
  await page.reload(); // Ensure the app picks up the flags and renders the sidebar
});

test("TC: SALEOR_16 User should be able to navigate to installed extensions and view plugin details as a staff member using PLUGINS permission #e2e", async ({
  page,
}) => {
  await extensionsPage.gotoExtensionsList();
  await expect(extensionsPage.installedExtensionsList).toBeVisible();
  await extensionsPage.expectInstalledPluginRowsCount(expectedExtensions.length);

  await Promise.all(
    expectedExtensions.map(name => extensionsPage.expectPluginRowVisibleByName(name)),
  );

  await extensionsPage.clickViewDetailsByPluginName("Admin emails");
  await extensionsPage.expectPluginDetailsViewVisible();
});
