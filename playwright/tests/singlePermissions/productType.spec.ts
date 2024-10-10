import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configurationPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { ProductTypePage } from "@pages/productTypePage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "productTypeAndAttribute" });

test("TC: SALEOR_17 User should be able to navigate to product type list as a staff member using PRODUCT TYPE permission @e2e", async ({
  page,
}) => {
  const configurationPage = new ConfigurationPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const productTypePage = new ProductTypePage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openProductTypes();
  await expect(productTypePage.addProductTypeButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(3);
});
