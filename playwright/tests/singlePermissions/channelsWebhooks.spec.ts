import { ChannelPage } from "@pages/channelsPage";
import { ConfigurationPage } from "@pages/configurationPage";
import { CustomAppDetailsPage } from "@pages/customAppDetailsPage";
import { ExtensionsPage } from "@pages/extensionsPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

import { createCustomApp, deleteCustomApp } from "../../api/appApi";

test.use({ permissionName: "channel" });

let channelPage: ChannelPage;
let mainMenuPage: MainMenuPage;
let configurationPage: ConfigurationPage;
let home: HomePage;
let extensionsPage: ExtensionsPage;
let customAppDetailsPage: CustomAppDetailsPage;

// Store created app details for teardown
// let createdApp: { id: string; token: string } | null = null;
// const testAppName = "Test Channel App For TC12";

// test.beforeAll(async ({ request }) => {
//   // Create a custom app with MANAGE_CHANNELS permission before tests run
//   createdApp = await createCustomApp(request, testAppName, ["MANAGE_CHANNELS"]);
// });

// test.afterAll(async ({ request }) => {
//   // Delete the custom app after all tests are done
//   if (createdApp) {
//     await deleteCustomApp(request, createdApp.id);
//   }
// });

test.beforeEach(async ({ page }) => {
  channelPage = new ChannelPage(page);
  mainMenuPage = new MainMenuPage(page);
  configurationPage = new ConfigurationPage(page);
  home = new HomePage(page);
  extensionsPage = new ExtensionsPage(page);
  customAppDetailsPage = new CustomAppDetailsPage(page);

  // TODO: Remove this once removed feature flag
  await page.goto("/"); // Navigate to root to set localStorage on correct origin
  await page.evaluate(() => {
    localStorage.setItem(
      "FF_extensions_dev",
      JSON.stringify({ enabled: true, payload: "default" }),
    );
  });
  await page.reload(); // Ensure the app picks up the flags and renders the sidebar

  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
});

test("TC: SALEOR_11 User should be able to navigate to channel list as a staff member using CHANNEL permission #e2e", async () => {
  await mainMenuPage.openConfiguration();
  await mainMenuPage.expectMenuItemsCount(3);
  await configurationPage.openChannels();
  await expect(channelPage.createChannelButton).toBeVisible();
  await expect(channelPage.deleteChannelButton.first()).toBeVisible();
});

test("TC: SALEOR_12 User with CHANNEL permission can navigate to add custom app page and see channel permissions #e2e", async () => {
  await mainMenuPage.openExtensions();
  await extensionsPage.clickAddExtensionButton();
  await extensionsPage.clickAddCustomExtensionButton();

  await customAppDetailsPage.expectManageChannelsCheckboxVisible();
  await customAppDetailsPage.expectSaveButtonVisible();
});

// test("TC: SALEOR_XXX User should see created custom app on the list and navigate to its details page #e2e", async ({
//   page,
// }) => {
//   await mainMenuPage.openExtensions();
//
//   const appRow = extensionsPage.installedExtensionsRow.filter({ hasText: testAppName });
//
//   await expect(appRow).toBeVisible();
//   await extensionsPage.clickViewDetailsByAppName(testAppName);
//   await expect(page.getByRole("heading", { name: testAppName })).toBeVisible();
// });
