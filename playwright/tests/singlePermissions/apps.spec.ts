import { AppsPage } from "@pages/appsPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "app" });

let mainMenuPage: MainMenuPage;
let appsPage: AppsPage;
let home: HomePage;

test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  appsPage = new AppsPage(page);
  home = new HomePage(page);
});
test("TC: SALEOR_10 User should be able to navigate to apps list as a staff member using APP permission @e2e", async () => {
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
  await mainMenuPage.openApps();
  await appsPage.installedAppsList.waitFor({
    state: "visible",
    timeout: 30000,
  });
  await expect(appsPage.installExternalAppButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
});
