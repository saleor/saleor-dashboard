import { MailpitService } from "@api/mailpit";
import { AVAILABILITY } from "@data/copy";
import { PRODUCTS } from "@data/e2eTestData";
import { ProductCreateDialog } from "@pages/dialogs/productCreateDialog";
import { ProductPage } from "@pages/productPage";
import { VariantsPage } from "@pages/variantsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let productPage: ProductPage;
let productCreateDialog: ProductCreateDialog;
let variantsPage: VariantsPage;
let mailpitService: MailpitService;

test.beforeEach(({ page, request }) => {
  productPage = new ProductPage(page);
  productCreateDialog = new ProductCreateDialog(page);
  variantsPage = new VariantsPage(page);
  mailpitService = new MailpitService(request);
});
test("TC: SALEOR_3 Create basic product with variants @e2e @product", async () => {
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
test("TC: SALEOR_5 Create basic - single product type - product without variants @e2e @product", async () => {
  await productPage.gotoCreateProductPage(PRODUCTS.singleProductType.id);
  await productPage.rightSideDetailsPage.selectOneChannelAsAvailableWhenMoreSelected("Channel-PLN");
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
test("TC: SALEOR_26 Create basic info variant - via edit variant page @e2e @product", async () => {
  const variantName = `TC: SALEOR_26 - variant name - ${new Date().toISOString()}`;

  await productPage.gotoExistingProductPage(PRODUCTS.productWithOneVariant.id);
  await productPage.clickFirstEditVariantButton();
  await variantsPage.clickAddVariantButton();
  await variantsPage.typeVariantName(variantName);
  await variantsPage.clickMageChannelsButton();
  await variantsPage.channelSelectDialog.clickAllChannelsCheckbox();
  await variantsPage.channelSelectDialog.selectChannel("Channel-PLN");
  await variantsPage.channelSelectDialog.clickConfirmButton();
  await variantsPage.typeSellingPriceInChannel("PLN");
  await variantsPage.typeCostPriceInChannel("PLN");
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
  await expect(
    variantsPage.variantsList.locator(variantsPage.variantsNames, {
      hasText: variantName,
    }),
    `New variant name: ${variantName} should be visible on the list`,
  ).toBeVisible();
});
test("TC: SALEOR_27 Create full info variant - via edit variant page @e2e @product", async () => {
  const variantName = `TC: SALEOR_27 - variant name - ${new Date().toISOString()}`;

  await productPage.gotoExistingProductPage(PRODUCTS.productWithOneVariant.id);
  await productPage.clickFirstEditVariantButton();
  await variantsPage.clickAddVariantButton();
  await variantsPage.typeVariantName(variantName);
  await variantsPage.clickMageChannelsButton();
  await variantsPage.channelSelectDialog.clickAllChannelsCheckbox();
  await variantsPage.channelSelectDialog.selectChannel("Channel-PLN");
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
    `New variant name: ${variantName} should be visible on the list`,
  ).toBeVisible();
  await variantsPage.selectWarehouse();
  await variantsPage.typeQuantityInStock();
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
});
test("TC: SALEOR_44 As an admin I should be able to delete a several products @basic-regression @product @e2e", async () => {
  await productPage.gotoProductListPage();

  await productPage.searchAndFindRowIndexes("a product to be deleted via bulk");
  await productPage.checkListRowsBasedOnContainingText(PRODUCTS.productsToBeBulkDeleted.names);

  await productPage.clickBulkDeleteGridRowsButton();
  await productPage.clickBulkDeleteButton();
  await productPage.deleteProductDialog.clickDeleteButton();
  await productPage.expectSuccessBanner();
  await productPage.gotoProductListPage();

  expect(
    await productPage.findRowIndexBasedOnText(PRODUCTS.productsToBeBulkDeleted.names),
    `Given products: ${PRODUCTS.productsToBeBulkDeleted.names} should be deleted from the list`,
  ).toEqual([]);
});
test("TC: SALEOR_45 As an admin I should be able to delete a single products @basic-regression @product @e2e", async () => {
  await productPage.gotoExistingProductPage(
    PRODUCTS.productWithOneVariantToBeDeletedFromDetails.id,
  );
  await productPage.clickDeleteProductButton();
  await productPage.deleteProductDialog.clickDeleteButton();
  await productPage.expectSuccessBannerMessage("Product Removed");
  await productPage.waitForGrid();
  await productPage.searchforProduct(PRODUCTS.productWithOneVariantToBeDeletedFromDetails.name);
  await expect(
    productPage.gridCanvas.filter({
      hasText: PRODUCTS.productWithOneVariantToBeDeletedFromDetails.name,
    }),
  ).not.toBeVisible();
});
test("TC: SALEOR_46 As an admin, I should be able to update a product by uploading media, assigning channels, assigning tax, and adding a new variant   @basic-regression @product @e2e", async () => {
  const newVariantName = "variant 2";

  await productPage.gotoExistingProductPage(PRODUCTS.singleProductTypeToBeUpdated.id);
  await productPage.clickUploadMediaButton();
  await productPage.uploadProductImage("beer.avif");
  await productPage.productImage.waitFor({ state: "visible" });
  await productPage.rightSideDetailsPage.selectOneChannelAsAvailableWhenNoneSelected("Channel-PLN");
  await productPage.selectFirstTaxOption();

  const preSaveTax = await productPage.rightSideDetailsPage.taxInput.locator("input").inputValue();

  await productPage.waitForGrid();
  await productPage.clickDatagridFullscreenButton();
  await productPage.clickAddVariantButton();
  await productPage.editVariantButton.nth(1).scrollIntoViewIfNeeded();
  await productPage.clickGridCell(1, 1, 1);
  await productPage.fillGridCell(1, 1, newVariantName, 1);
  await productPage.clickDatagridFullscreenButton(1);
  await productPage.clickSaveButton();
  await productPage.expectSuccessBanner();

  const postSaveTax = await productPage.rightSideDetailsPage.taxInput.locator("input").inputValue();

  expect(preSaveTax, "Pre save tax name should be equal as the one after save").toEqual(
    postSaveTax,
  );
  await productPage.gridCanvas.getByText(newVariantName).waitFor({ state: "attached" });
  await expect(
    productPage.productAvailableInChannelsText,
    "Label copy shows 1 out of 7 channels ",
  ).toContainText(AVAILABILITY.in1OutOf);
  expect(
    await productPage.productImage.count(),
    "Newly added single image should be present",
  ).toEqual(1);
});
test("TC: SALEOR_56 As an admin, I should be able to export products from single channel as CSV file @basic-regression @product @e2e", async () => {
  await productPage.gotoProductListPage();
  await productPage.clickCogShowMoreButtonButton();
  await productPage.clickExportButton();
  await productPage.exportProductsDialog.clickChannelsAccordion();
  await productPage.exportProductsDialog.checkChannelCheckbox("PLN");
  await productPage.exportProductsDialog.clickNextButton();
  await productPage.exportProductsDialog.clickExportAllProductsRadioButton();
  await productPage.exportProductsDialog.clickSubmitButton();
  await productPage.expectInfoBanner();
  await mailpitService.checkDoesUserReceivedExportedData(
    process.env.E2E_USER_NAME!,
    "Your exported products data is ready",
  );
});
test("TC: SALEOR_57 As an admin, I should be able to search products on list view @basic-regression @product @e2e", async () => {
  await productPage.gotoProductListPage();
  await productPage.searchAndFindRowIndexes(PRODUCTS.productToAddVariants.name);
  await productPage.checkListRowsBasedOnContainingText([PRODUCTS.productToAddVariants.name]);
  expect(
    await productPage.gridCanvas.locator("table tbody tr").count(),
    "There should be only one product visible on list",
  ).toEqual(1);
});
test("TC: SALEOR_58 As an admin I should be able use pagination on product list view @basic-regression @product @e2e", async () => {
  await productPage.gotoProductListPage();

  const firstPageProductName = await productPage.getGridCellText(0, 0);

  await productPage.clickNextPageButton();
  await productPage.waitForGrid();

  const secondPageProductName = await productPage.getGridCellText(1, 1);

  expect(
    firstPageProductName,
    `Second side first product name: ${secondPageProductName} should be visible and be different than: ${firstPageProductName}`,
  ).not.toEqual(secondPageProductName);
  await expect(
    productPage.gridCanvas,
    `Product from first page: ${firstPageProductName} should not be visible`,
  ).not.toContainText(firstPageProductName);
  await productPage.clickPreviousPageButton();
  await productPage.waitForGrid();
  await expect(
    productPage.gridCanvas,
    `Product from first page: ${firstPageProductName} should be visible again`,
  ).toContainText(firstPageProductName);
});
test("TC: SALEOR_59 As an admin I should be able to filter products by channel on product list view @basic-regression @product @e2e", async () => {
  await productPage.gotoProductListPage();
  await productPage.searchAndFindRowIndexes(PRODUCTS.productAvailableOnlyInUsdChannel.name);
  expect(
    await productPage.gridCanvas.locator("table tbody tr").count(),
    `Product: ${PRODUCTS.productAvailableOnlyInUsdChannel.name} should be visible on grid table`,
  ).toEqual(1);
  await productPage.typeInSearchOnListView("");
  await productPage.clickFilterButton();
  await productPage.filtersPage.pickFilter("Channel", "Channel-PLN");
  await productPage.filtersPage.clickSaveFiltersButton();
  await expect(
    productPage.gridCanvas,
    `Product: ${PRODUCTS.productAvailableOnlyInUsdChannel.name} should not be visible on grid table`,
  ).not.toContainText(PRODUCTS.productAvailableOnlyInUsdChannel.name);
  await expect(
    productPage.gridCanvas,
    `Product: ${PRODUCTS.productAvailableOnlyInPlnChannel.name} should be visible on grid table`,
  ).toContainText(PRODUCTS.productAvailableOnlyInPlnChannel.name);
});
test("TC: SALEOR_60 As an admin I should be able update existing variant @basic-regression @product @e2e", async () => {
  const variantName = `TC: SALEOR_60 - variant name - ${new Date().toISOString()}`;
  const sku = `SALEOR_60-sku-${new Date().toISOString()}`;

  await productPage.waitForNetworkIdleAfterAction(() =>
    variantsPage.gotoExistingVariantPage(
      PRODUCTS.productWithVariantWhichWillBeUpdated.id,
      PRODUCTS.productWithVariantWhichWillBeUpdated.variantId,
    ),
  );
  await variantsPage.typeVariantName(variantName);
  await variantsPage.clickMageChannelsButton();
  await variantsPage.channelSelectDialog.clickAllChannelsCheckbox();
  await variantsPage.channelSelectDialog.selectLastChannel();
  await variantsPage.channelSelectDialog.clickConfirmButton();
  await variantsPage.selectLastAttributeValue();
  await variantsPage.typeCheckoutLimit("50");
  await variantsPage.typeShippingWeight("1000");
  await variantsPage.typeSellingPriceInChannel("USD", "120");
  await variantsPage.typeCostPriceInChannel("USD", "100");
  await variantsPage.typeSku(sku);
  await variantsPage.selectWarehouse("Africa");
  await variantsPage.typeQuantityInStock("Africa", "5000");
  await variantsPage.clickSaveVariantButton();
  await variantsPage.expectSuccessBanner();
  await expect(
    variantsPage.variantsList.locator(variantsPage.variantsNames, {
      hasText: variantName,
    }),
    `Updated name: ${variantName} should be visible on list`,
  ).toBeVisible();
  await productPage.productImage.waitFor({ state: "visible" });
});
test("TC: SALEOR_61 As an admin I should be able to delete existing variant @basic-regression @product @e2e", async () => {
  await productPage.waitForNetworkIdleAfterAction(() =>
    variantsPage.gotoExistingVariantPage(
      PRODUCTS.singleVariantDeleteProduct.productId,
      PRODUCTS.singleVariantDeleteProduct.variantId,
    ),
  );
  await variantsPage.clickDeleteVariantButton();
  await variantsPage.deleteVariantDialog.clickDeleteVariantButton();
  await productPage.expectSuccessBanner();
  await expect(
    productPage.noVariantsText,
    "Message about how to add new variant should be visible in place of list of variants",
  ).toBeVisible();
  expect(
    productPage.page.url(),
    "Deleting last variant from variant details page should redirect to product page",
  ).toContain(PRODUCTS.singleVariantDeleteProduct.productId);
});
test("TC: SALEOR_62 As an admin I should be able to bulk delete existing variants @basic-regression @product @e2e", async () => {
  await productPage.waitForNetworkIdleAfterAction(() =>
    productPage.gotoExistingProductPage(PRODUCTS.multipleVariantsBulkDeleteProduct.productId),
  );
  await productPage.waitForGrid();
  await productPage.gridCanvas.scrollIntoViewIfNeeded();
  await productPage.clickGridCell(0, 0);
  await productPage.clickGridCell(0, 1);
  await productPage.clickGridCell(0, 2);
  await productPage.clickBulkDeleteGridRowsButton();
  await expect(
    productPage.noVariantsText,
    "Message about how to add new variant should be visible in place of list of variants",
  ).toBeVisible();
  await productPage.clickSaveButton();
  await productPage.expectSuccessBanner();
  await expect(
    productPage.noVariantsText,
    "Message about how to add new variant should be visible in place of list of variants",
  ).toBeVisible();
});
