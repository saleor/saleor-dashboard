import * as faker from "faker";

import { ProductTypePage } from "@pages/productTypePage";
import { test } from "@playwright/test";

test.use({ storageState: "./playwright/.auth/admin.json" });
const productTypeName = `e2e-product-type-${faker.datatype.number()}`;

test("TC: SALEOR_1 Create basic product type @e2e @product-type", async ({
  page,
}) => {
  const productTypePage = new ProductTypePage(page);

  await productTypePage.gotoProductTypeListPage();
  await productTypePage.clickCreateProductTypeButton();
  await productTypePage.typeProductTypeName(productTypeName);
  await productTypePage.makeProductShippableWithWeight();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
});
test("TC: SALEOR_2 Create gift card product type @e2e @product-type", async ({
  page,
}) => {
  const productTypePage = new ProductTypePage(page);

  await productTypePage.gotoAddProductTypePage();
  await productTypePage.typeProductTypeName(productTypeName);
  await productTypePage.selectGiftCardButton();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
});
