import * as faker from "faker";

import { ProductTypeListPage } from "@pages/product-type-list-page";
import { ProductTypePage } from "@pages/product-type-page";
import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
const name = `e2e-product-type-${faker.datatype.number()}`;

test("TC: SALEOR_1 Create basic product type @basic-regression @product-type", async ({
  page,
}) => {
  const productTypeListPage = new ProductTypeListPage(page);
  const productTypeAddPage = new ProductTypePage(page);

  await productTypeListPage.goto();
  await productTypeListPage.clickCreateProductTypeButton();
  await productTypeAddPage.typeProductTypeName(name);
  await productTypeAddPage.makeProductShippableWithWeight();
  await productTypeAddPage.clickSaveButton();
  await productTypeAddPage.expectSuccessBanner();
});
test("TC: SALEOR_2 Create gift card product type @basic-regression @product-type", async ({
  page,
}) => {
  const productTypeAddPage = new ProductTypePage(page);

  await productTypeAddPage.goto();
  await productTypeAddPage.typeProductTypeName(name);
  await productTypeAddPage.selectGiftCardButton();
  await productTypeAddPage.clickSaveButton();
  await productTypeAddPage.expectSuccessBanner();
});
