import { URL_LIST } from "@data/url";
import { ConfigurationPage } from "@pages/configuration-page";
import { MainMenuPage } from "@pages/main-menu-page";
import { ProductTypePage } from "@pages/product-type-page";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/product-type.json" });

test("TC: SALEOR_17 User should be able to navigate to product type list as a staff member using PRODUCT TYPE permission", async ({
  page,
}) => {
  const configurationPage = new ConfigurationPage(page);
  const mainMenuPage = new MainMenuPage(page);
  const productTypePage = new ProductTypePage(page);

  await page.goto(URL_LIST.configuration);
  await configurationPage.openProductTypes();
  await expect(productTypePage.addProductTypeButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(2);
});
