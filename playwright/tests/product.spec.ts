import { ProductCreateDialog } from "@pages/dialogs/product-create-dialog";
import { ProductListPage } from "@pages/product-list-page";
import { ProductPage } from "@pages/product-page";
import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_3 Create basic product with variants @basic-regression @product-type", async ({
  page,
}) => {
  const productListPage = new ProductListPage(page);
  const productCreateDialog = new ProductCreateDialog(page);
  const productPage = new ProductPage(page);

  await productListPage.goto();
  await productListPage.clickCreateProductButton();
  await productCreateDialog.selectProductTypeWithVariants();
  await productCreateDialog.clickConfirmButton();
  await productPage.typeNameDescAndRating();
  await productPage.addSeo();
  await productPage.addAllMetaData();
  await productPage.selectFirstCategory();
  await productPage.selectFirstTaxOption();
  await productPage.clickSaveButton();
  await productPage.expectSuccessBanner();
});
