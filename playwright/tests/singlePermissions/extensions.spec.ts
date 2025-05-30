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
  await expect(extensionsPage.installExternalAppButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(4);
});
