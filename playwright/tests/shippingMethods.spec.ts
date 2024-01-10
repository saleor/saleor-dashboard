import { SHIPPING_METHODS } from "@data/e2eTestData";
import { ShippingMethodsPage } from "@pages/shippingMethodsPage";
import { ShippingRatesPage } from "@pages/shippingRatesPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_31 Create basic shipping method @shipping-method @e2e", async ({
                                                                                  page,
                                                                                }) => {
  const shippingMethodsPage = new ShippingMethodsPage(page);

  await shippingMethodsPage.gotoListView();
  await shippingMethodsPage.clickCreateShippingZoneButton();
  await shippingMethodsPage.typeShippingZoneName();
  await shippingMethodsPage.typeShippingZoneDescription();
  await shippingMethodsPage.clickAssignCountryButton();
  await shippingMethodsPage.assignCountriesDialog.checkAndSaveSingleCountry();
  await shippingMethodsPage.saveShippingZone();
  await shippingMethodsPage.basePage.expectSuccessBanner();

  await shippingMethodsPage.rightSideDetailsPage.clickChannelsSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.selectSingleChannelShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.clickWarehouseSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.typeAndSelectSingleWarehouseShippingPage();
  await shippingMethodsPage.saveShippingZone();
  await shippingMethodsPage.basePage.expectSuccessBanner();
});
test("TC: SALEOR_32 Add price rate to shipping method - with excluded zip codes and excluded product @shipping-method @e2e", async ({
                                                                                                                                      page,
                                                                                                                                    }) => {
  const shippingMethodsPage = new ShippingMethodsPage(page);
  const shippingRatesPage = new ShippingRatesPage(page);

  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithoutRates.id,
  );
  await shippingMethodsPage.clickAddPriceRateButton();
  await shippingMethodsPage.rightSideDetailsPage.selectTaxIndex(1);
  await shippingRatesPage.typeRateName();
  await shippingRatesPage.typeRateDescription();
  await shippingRatesPage.typeRateMinDeliveryTime();
  await shippingRatesPage.typeRateMaxDeliveryTime();
  await shippingRatesPage.typeMaxAndMinValues();
  await shippingRatesPage.typePrice();
  await shippingRatesPage.addPostalCodeRange();
  await shippingRatesPage.clickSaveButton();
  await shippingRatesPage.basePage.expectSuccessBanner();

  await shippingRatesPage.addFirstAvailableExcludedProduct();
  await shippingRatesPage.basePage.expectSuccessBanner();
  await shippingRatesPage.excludedProductsRows.waitFor({ state: "visible" });
  await expect(await shippingRatesPage.excludedProductsRows.count()).toEqual(1);
  await expect(await shippingRatesPage.assignedPostalCodesRows.count()).toEqual(
    1,
  );
});
test("TC: SALEOR_33 Add weight rate to shipping method - with included zip codes and excluded product @shipping-method @e2e", async ({
                                                                                                                                       page,
                                                                                                                                     }) => {
  const shippingMethodsPage = new ShippingMethodsPage(page);
  const shippingRatesPage = new ShippingRatesPage(page);

  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithoutRates.id,
  );
  await shippingMethodsPage.clickAddWeightRateButton();
  await shippingMethodsPage.rightSideDetailsPage.selectTaxIndex(1);
  await shippingRatesPage.typeRateName();
  await shippingRatesPage.typeRateDescription();
  await shippingRatesPage.typeRateMinDeliveryTime();
  await shippingRatesPage.typeRateMaxDeliveryTime();
  await shippingRatesPage.typeMaxAndMinWeights();
  await shippingRatesPage.typePrice();
  await shippingRatesPage.clickIncludePostalCodesRadioButton();
  await shippingRatesPage.addPostalCodeRange();
  await shippingRatesPage.clickSaveButton();
  await shippingRatesPage.basePage.expectSuccessBanner();

  await shippingRatesPage.addFirstAvailableExcludedProduct();
  await shippingRatesPage.basePage.expectSuccessBanner();
  await shippingRatesPage.excludedProductsRows.waitFor({ state: "visible" });
  await expect(await shippingRatesPage.excludedProductsRows.count()).toEqual(1);
  await expect(await shippingRatesPage.assignedPostalCodesRows.count()).toEqual(
    1,
  );
});

test("TC: SALEOR_34 Delete a single shipping method from the shipping zone details page @shipping-method @e2e", async ({
                                                                                                                         page,
                                                                                                                       }) => {
  const shippingMethodsPage = new ShippingMethodsPage(page);
  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.id,
  );
  await expect(shippingMethodsPage.basePage.pageHeader).toBeVisible();
  const priceBasedRate = SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.rates.priceBasedRateToBeDeleted.name;
  await expect(shippingMethodsPage.priceBasedRatesSection).toContainText(priceBasedRate);
  await shippingMethodsPage.clickDeleteShippingMethod();
  await shippingMethodsPage.deleteShippingMethodDialog.clickDeleteButton();
  await shippingMethodsPage.basePage.expectSuccessBanner();
  await expect(shippingMethodsPage.priceBasedRatesSection).toContainText("No shipping rates found");
  await expect(shippingMethodsPage.priceBasedRatesSection).not.toContainText(priceBasedRate);
});

