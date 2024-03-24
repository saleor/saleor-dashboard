import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { ConfigurationPage } from "@pages/configurationPage";
import { ContentPage } from "@pages/contentPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { PageTypesPage } from "@pages/pageTypesPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/page.json" });

test("TC: SALEOR_14 User should be able to navigate to content list as a staff member using CONTENT aka PAGE permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const contentPage = new ContentPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openContent();
  await expect(contentPage.createContentButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
  await basePage.expectGridToBeAttached();
});
test("TC: SALEOR_15 User should be able to navigate to page types list as a staff member using CONTENT aka PAGE permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const configurationPage = new ConfigurationPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const pageTypesPage = new PageTypesPage(page);

  await page.goto(URL_LIST.configuration);
  await expect(configurationPage.taxesButton).toBeVisible();
  await expect(configurationPage.pageTypesButton).toBeVisible();
  await expect(configurationPage.webhooksAndEventsButton).toBeVisible();

  await configurationPage.openPageTypes();
  await expect(pageTypesPage.createPageTypeButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
