import { PRODUCTS } from "@data/testData";
import { BasePage } from "@pages/basePage";
import { ProductCreateDialog } from "@pages/dialogs/productCreateDialog";
import { ProductPage } from "@pages/productPage";
import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_3 Create basic product with variants @basic-regression @product", async ({
  page,
}) => {
  const productCreateDialog = new ProductCreateDialog(page);
  const productPage = new ProductPage(page);

  await productPage.gotoProductListPage();
  await productPage.clickCreateProductButton();
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
test("TC: SALEOR_5 Create basic product without variants @basic-regression @product", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const productPage = new ProductPage(page);

  await basePage.gotoCreateProductPage(PRODUCTS.singleProductType.id);
  await productPage.selectOneChannelAsAvailable();
  await productPage.typeNameDescAndRating();
  await productPage.addSeo();
  await productPage.addAllMetaData();
  await productPage.selectFirstCategory();
  await productPage.selectFirstTaxOption();
  await productPage.typeSellingPriceForChannel("PLN");
  await productPage.typeCostPrice("PLN");
  await productPage.clickSaveButton();
  await productPage.expectSuccessBanner();
});
