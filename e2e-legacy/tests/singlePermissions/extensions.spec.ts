import { ExtensionsPage } from "@pages/extensionsPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "app" });

let mainMenuPage: MainMenuPage;
let extensionsPage: ExtensionsPage;
let home: HomePage;

test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  extensionsPage = new ExtensionsPage(page);
  home = new HomePage(page);
});

test("TC: SALEOR_10 User should be able to navigate to extensions list as a staff member using APP permission #e2e", async () => {
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
  await mainMenuPage.openExtensions();
  await extensionsPage.installedExtensionsList.waitFor({
    state: "visible",
    timeout: 30000,
  });
  await extensionsPage.addExtensionsOpenDropdownButton.click();
  await expect(extensionsPage.exploreExtensionsOption).toBeVisible();
  await expect(extensionsPage.installCustomExtensionOption).toBeVisible();
  await expect(extensionsPage.addCustomExtensionOption).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(4);
});

test("TC: SALEOR_131 User with MANAGE_APPS permission can install apps but not plugins on explore extensions page #e2e", async () => {
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
  await mainMenuPage.openExploreExtensions();
  await extensionsPage.waitForContentLoad();

  // Assert: App install buttons should be enabled
  const appInstallButtons = await extensionsPage.appExtensionExploreInstallButtons.all();

  for (const button of appInstallButtons) {
    await expect(button).toBeEnabled();
  }

  // Assert: Plugin install buttons should be disabled
  const pluginInstallButtons = await extensionsPage.pluginExtensionExploreInstallButtons.all();

  for (const button of pluginInstallButtons) {
    await expect(button).toBeDisabled();
  }
});
