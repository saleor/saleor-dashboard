import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { ShippingMethodsPage } from "@pages/shippingMethodsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "shipping" });

test("TC: SALEOR_21 User should be able to navigate to shipping zones page as a staff member using SHIPPING permission @e2e", async ({
  page,
}) => {
  const mainMenuPage = new MainMenuPage(page);
  const configurationPage = new ConfigurationPage(page);
  const shippingMethodsPage = new ShippingMethodsPage(page);

  await page.goto(URL_LIST.configuration);
  await page.waitForTimeout(8000);
  await configurationPage.openShippingMethods();
  await expect(shippingMethodsPage.createShippingZoneButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
