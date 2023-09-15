import { LOCATORS } from "@data/common-locators";
import { ProductCreateDialog } from "@pages/dialogs/product-create-dialog";
import { ProductListPage } from "@pages/product-list-page";
import { ProductPage } from "@pages/product-page";
import {
  expect,
  test,
} from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_3 Create basic product type @basic-regression @product-type", async ({
  page,
}) => {
  const productListPage = new ProductListPage(page);
  await productListPage.goto();
  await page.waitForTimeout(5000);
  await productListPage.clickCreateProductButton();
  const productCreateDialog = new ProductCreateDialog(page);
  await productCreateDialog.selectProductTypeWithVariants();
  await productCreateDialog.clickConfirmButton();
  const productPage = new ProductPage(page);
  await productPage.typeNameDescAndRating();
  await productPage.addSeo();
  await productPage.addAllMetaData();
  await productPage.selectFirstCategory();
  await productPage.selectFirstTaxOption();
  await productPage.clickSaveButton();
  await expect(page.locator(LOCATORS.successBanner)).toBeVisible();
});
