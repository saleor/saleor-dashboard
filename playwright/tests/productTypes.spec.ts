import * as faker from "faker";
import { PRODUCT_TYPES } from "@data/e2eTestData";
import { ProductTypePage } from "@pages/productTypePage";
import { test, expect } from "@playwright/test";

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

test("TC: SALEOR_137 As a admin I can edit product type @e2e @product-type", async ({
  page,
}) => {
  const productTypePage = new ProductTypePage(page);

  await productTypePage.gotoExistingProductTypePage(PRODUCT_TYPES.productTypeToBeEdited.id);
  await productTypePage.typeProductTypeName(productTypeName);
  await productTypePage.makeProductShippableWithWeight();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
});

// test("TC: SALEOR_138 As a admin user I can delete product type with assigned products @e2e @product-type", async ({
//   page,
// }) => {
//   const productTypePage = new ProductTypePage(page);

//   await productTypePage.gotoExistingProductTypePage(PRODUCT_TYPES.productTypeToBeRemoved.id);

// });

test("TC: SALEOR_139 As a admin user I can delete several product types@e2e @product-type", async ({
  page,
}) => {
  const productTypePage = new ProductTypePage(page);
  const rowsToBeDeleted = PRODUCT_TYPES.productTypesToBeBulkDeleted.ids;
  const productTypeNames = PRODUCT_TYPES.productTypesToBeBulkDeleted.names;

  await productTypePage.gotoProductTypeListPage();
  await expect(productTypePage.productTypeList).toBeVisible();
  await productTypePage.checkProductTypesOnList(rowsToBeDeleted);
  await productTypePage.clickBulkDeleteButton();
  await productTypePage.deleteProductTypeDialog.clickConfirmDeleteButton();
  await productTypePage.expectSuccessBanner();
  await expect(productTypePage.productTypeList).toBeVisible();
  await expect(
    productTypePage.checkProductTypesListBasedOnNotContainingText(productTypeNames))
    .toBeTruthy();
});