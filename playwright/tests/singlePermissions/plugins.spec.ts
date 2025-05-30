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
});

test("TC: SALEOR_16 User should be able to navigate to installed extensions and view plugin details as a staff member using PLUGINS permission #e2e", async ({
  page,
}) => {
  await extensionsPage.gotoInstalledExtensionsList();
  await expect(extensionsPage.installedExtensionsList).toBeVisible();
  await extensionsPage.expectInstalledPluginRowsCount(expectedExtensions.length);

  await Promise.all(
    expectedExtensions.map(name => extensionsPage.expectPluginRowVisibleByName(name)),
  );

  await extensionsPage.clickViewDetailsByPluginName("Admin emails");
  await extensionsPage.expectPluginDetailsViewVisible();
});
