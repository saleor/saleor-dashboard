import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { SiteSettingsPage } from "@pages/siteSettingsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "settings" });

test("TC: SALEOR_18 User should be able to navigate to configuration as a staff member using SETTINGS permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const configurationPage = new ConfigurationPage(page);
  const siteSettingsPage = new SiteSettingsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openConfiguration();
  await configurationPage.openSiteSettings();
  await expect(siteSettingsPage.companyInfoSection).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
