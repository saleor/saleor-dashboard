import { PRODUCT_TYPES } from "@data/e2eTestData";
import { ProductTypePage } from "@pages/productTypePage";
import { expect } from "@playwright/test";
import * as faker from "faker";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

const productTypeName = `e2e-product-type-${faker.datatype.number()}`;

test("TC: SALEOR_1 Create basic product type @e2e @product-type", async ({ page }) => {
  const productTypePage = new ProductTypePage(page);

  await productTypePage.gotoProductTypeListPage();
  await productTypePage.clickCreateProductTypeButton();
  await productTypePage.typeProductTypeName(productTypeName);
  await productTypePage.makeProductShippableWithWeight();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
  await expect(productTypePage.nameInput).toHaveValue(productTypeName);
});
test("TC: SALEOR_2 Create gift card product type @e2e @product-type", async ({ page }) => {
  const productTypePage = new ProductTypePage(page);

  await productTypePage.gotoAddProductTypePage();
  await productTypePage.typeProductTypeName(productTypeName);
  await productTypePage.selectGiftCardButton();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
  await expect(productTypePage.nameInput).toHaveValue(productTypeName);
});
test("TC: SALEOR_184 As a admin I can edit product type @e2e @product-type", async ({ page }) => {
  const productTypePage = new ProductTypePage(page);
  const updatedProductTypeName = `updated-e2e-product-type-${faker.datatype.number()}`;

  await productTypePage.gotoExistingProductTypePage(PRODUCT_TYPES.productTypeToBeEdited.id);
  await productTypePage.updateProductTypeName(updatedProductTypeName);
  await productTypePage.makeProductShippableWithWeight();
  await productTypePage.clickSaveButton();
  await productTypePage.expectSuccessBanner();
  await expect(productTypePage.isShippingRequired).toBeChecked();
  await expect(productTypePage.shippingWeightInput).toHaveValue("10");
  await expect(productTypePage.nameInput).toHaveValue(updatedProductTypeName);
});
test("TC: SALEOR_185 As a admin user I can delete product type with assigned products @e2e @product-type", async ({
  page,
}) => {
  const productTypePage = new ProductTypePage(page);
  const productTypeName = PRODUCT_TYPES.productTypeToBeRemoved.name;

  await productTypePage.gotoExistingProductTypePage(PRODUCT_TYPES.productTypeToBeRemoved.id);
  await productTypePage.clickDeleteButton();
  await productTypePage.deleteProductTypeDialog.clickConfirmDeletionCheckbox();
  await productTypePage.deleteProductTypeDialog.clickConfirmDeleteButton();
  await productTypePage.expectSuccessBanner();
  await productTypePage.productTypeList.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await expect(productTypePage.productTypeList).not.toContainText(productTypeName);
});
test("TC: SALEOR_186 As a admin user I can delete several product types @e2e @product-type", async ({
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
  await productTypePage.productTypeList.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await expect(productTypePage.productTypeList).not.toContainText(productTypeNames[0]);
  await expect(productTypePage.productTypeList).not.toContainText(productTypeNames[1]);
});
