import { PRODUCTS } from "@data/e2eTestData";
import { BasePage } from "@pages/basePage";
import { ProductCreateDialog } from "@pages/dialogs/productCreateDialog";
import { ProductPage } from "@pages/productPage";
import { VariantsPage } from "@pages/variantsPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_3 Create basic product with variants @e2e @product", async ({
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
test("TC: SALEOR_5 Create basic product without variants @e2e @product", async ({
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

test("TC: SALEOR_26 Create basic info variant - via edit variant page @e2e @product", async ({
  page,
}) => {
  const variantName = `TC: SALEOR_26 - variant name - ${new Date().toISOString()}`;
  const basePage = new BasePage(page);
  const productPage = new ProductPage(page);
  const variantsPage = new VariantsPage(page);

  await basePage.gotoExistingProductPage(PRODUCTS.productWithOneVariant.id);
  await productPage.clickFirstEditVariantButton();
  await variantsPage.clickAddVariantButton();
  await variantsPage.typeVariantName(variantName);
  await variantsPage.clickMageChannelsButton();
  await variantsPage.channelSelectDialog.clickAllChannelsCheckbox();
  await variantsPage.channelSelectDialog.selectFirstChannel();
  await variantsPage.channelSelectDialog.clickConfirmButton();
  await variantsPage.typeSellingPriceInChannel("PLN");
  await variantsPage.typeCostPriceInChannel("PLN");
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
  await expect(
    variantsPage.variantsList.locator(variantsPage.variantsNames, {
      hasText: variantName,
    }),
  ).toBeVisible();
});
test("TC: SALEOR_27 Create full info variant - via edit variant page @e2e @product", async ({
  page,
}) => {
  const variantName = `TC: SALEOR_27 - variant name - ${new Date().toISOString()}`;
  const basePage = new BasePage(page);
  const productPage = new ProductPage(page);
  const variantsPage = new VariantsPage(page);

  await basePage.gotoExistingProductPage(PRODUCTS.productWithOneVariant.id);
  await productPage.clickFirstEditVariantButton();
  await variantsPage.clickAddVariantButton();
  await variantsPage.typeVariantName(variantName);
  await variantsPage.clickMageChannelsButton();
  await variantsPage.channelSelectDialog.clickAllChannelsCheckbox();
  await variantsPage.channelSelectDialog.selectFirstChannel();
  await variantsPage.channelSelectDialog.clickConfirmButton();
  await variantsPage.selectFirstAttributeValue();
  await variantsPage.typeCheckoutLimit();
  await variantsPage.typeShippingWeight();
  await variantsPage.typeSellingPriceInChannel("PLN");
  await variantsPage.typeSku();
  await variantsPage.addAllMetaData();
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
  await expect(
    variantsPage.variantsList.locator(variantsPage.variantsNames, {
      hasText: variantName,
    }),
  ).toBeVisible();
  await variantsPage.selectWarehouse();
  await variantsPage.typeQuantityInStock();
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
});
test("TC: SALEOR_45 As an admin I should be able to delete a single product with variants @basic-regression @product @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const productPage = new ProductPage(page);

  await basePage.gotoExistingProductPage(
    PRODUCTS.productWithOneVariantToBeDeletedFromDetails.id,
  );
  await productPage.clickDeleteProductButton();
  await productPage.deleteProductDialog.clickDeleteButton();
  await await basePage.expectSuccessBannerMessage("Product Removed");
  await expect(basePage.gridCanvas.locator("table")).not.toContainText(
    PRODUCTS.productWithOneVariantToBeDeletedFromDetails.name,
  );
});
