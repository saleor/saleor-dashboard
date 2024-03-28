import { SiteSettingsPage } from "@pages/siteSettingsPage";
import { test } from "@playwright/test";

test("TC: SALEOR_ Change general information and save it", async ({ page }) => {
  const siteSettingsPage = new SiteSettingsPage(page);

  await siteSettingsPage.gotoSiteSettings();
  await siteSettingsPage.stockReservationForAuthUserInput.fill("200");
  await siteSettingsPage.stockReservationForAnonymousUserInput.fill("400");
  await siteSettingsPage.checkoutLineLimitInput.fill("70");
  await siteSettingsPage.companyInput.fill("Michalina_company");
  await siteSettingsPage.addressLine1Input.fill("Tęczowa");
  await siteSettingsPage.addressLine2Input.fill("7");
  await siteSettingsPage.city.fill("Wrocław");
  await siteSettingsPage.zipInput.fill("53-601");
  await siteSettingsPage.countryInput.selectOption("Poland");
  // jak wybiore poland a nie USA to znika country area
  //await siteSettingsPage.countryAreaDropdown.selectOption('');
  await siteSettingsPage.saveButton.click();
});
