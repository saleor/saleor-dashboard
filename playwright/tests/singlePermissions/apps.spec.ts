import { URL_LIST } from "@data/url";
import { AppsPage } from "@pages/appsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/app.json" });

test("TC: SALEOR_10 User should be able to navigate to apps list as a staff member using APP permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const appsPage = new AppsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openApps();
  await expect(appsPage.installExternalAppButton).toBeVisible();
  await expect(appsPage.appsLogosList.first()).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
});
