import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { SiteSettingsPage } from "@pages/siteSettingsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/settings.json" });

test("TC: SALEOR_18 User should be able to navigate to configuration as a staff member using SETTINGS permission", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const configurationPage = new ConfigurationPage(page);
  const siteSettingsPage = new SiteSettingsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openConfiguration();
  await configurationPage.openSiteSettings();
  await expect(siteSettingsPage.companyInfoSection).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
});
