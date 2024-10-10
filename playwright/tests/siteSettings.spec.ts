import { SiteSettingsPage } from "@pages/siteSettingsPage";
import { expect } from "@playwright/test";
import faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let siteSettingsPage: SiteSettingsPage;

test.beforeEach(({ page }) => {
  siteSettingsPage = new SiteSettingsPage(page);
});
test("TC: SALEOR_132 Should be able to update site settings @e2e", async () => {
  const companyName = faker.company.companyName();

  await siteSettingsPage.gotoSiteSettings();
  await siteSettingsPage.fillStockReservationForAuthUser("200");
  await siteSettingsPage.fillStockReservationForAnonUser("400");
  await siteSettingsPage.fillCheckoutLineLimitInput("70");
  await siteSettingsPage.completeAddressForm(
    companyName,
    "Hidden Valley Road",
    "1266",
    "Lancaster",
    "United States of America",
    "Pennsylvania",
    "17602",
    "7172893144",
  );
  await siteSettingsPage.emailConfirmationCheckbox.click();
  await siteSettingsPage.saveButton.click();
  await siteSettingsPage.expectSuccessBanner();
  await expect(siteSettingsPage.companyInfoSection).not.toBeEmpty();
  await expect(siteSettingsPage.companyInput).toHaveValue(companyName);
  await expect(siteSettingsPage.stockReservationForAuthUserInput).toHaveValue("200");
  await expect(siteSettingsPage.stockReservationForAnonUserInput).toHaveValue("400");
  await expect(siteSettingsPage.checkoutLineLimitInput).toHaveValue("70");
  await expect(siteSettingsPage.emailConfirmationCheckbox).not.toBeChecked();
});
