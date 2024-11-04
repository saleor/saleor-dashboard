import { CHANNELS, SHIPPING_METHODS, WAREHOUSES } from "@data/e2eTestData";
import { ShippingMethodsPage } from "@pages/shippingMethodsPage";
import { ShippingRatesPage } from "@pages/shippingRatesPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let shippingMethodsPage: ShippingMethodsPage;
let shippingRatesPage: ShippingRatesPage;

test.beforeEach(({ page }) => {
  test.slow();
  shippingMethodsPage = new ShippingMethodsPage(page);
  shippingRatesPage = new ShippingRatesPage(page);
});
test("TC: SALEOR_31 Create basic shipping method @shipping-method @e2e", async () => {
  await shippingMethodsPage.gotoListView();
  await shippingMethodsPage.clickCreateShippingZoneButton();
  await shippingMethodsPage.typeShippingZoneName();
  await shippingMethodsPage.typeShippingZoneDescription();
  await shippingMethodsPage.clickAssignCountryButton();
  await shippingMethodsPage.assignCountriesDialog.checkAndSaveSingleCountry();
  await shippingMethodsPage.saveShippingZone();
  await shippingMethodsPage.expectSuccessBanner();
  await shippingMethodsPage.rightSideDetailsPage.clickChannelsSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.selectSingleChannelShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.clickWarehouseSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.typeAndSelectSingleWarehouseShippingPage();
  await shippingMethodsPage.saveShippingZone();
  await shippingMethodsPage.expectSuccessBanner();
});
test("TC: SALEOR_32 Add price rate to shipping method - with excluded zip codes and excluded product @shipping-method @e2e", async () => {
  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithoutRates.id,
    SHIPPING_METHODS.shippingMethodWithoutRates.name,
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
  await shippingRatesPage.addExcludedProduct("Bean Juice");
  await shippingRatesPage.basePage.expectSuccessBanner();
  await shippingRatesPage.excludedProductsRows.waitFor({ state: "visible" });
  await expect(shippingRatesPage.excludedProductsRows).toContainText("Bean Juice");
  await expect(await shippingRatesPage.assignedPostalCodesRows.count()).toEqual(1);
});
test("TC: SALEOR_33 Add weight rate to shipping method - with included zip codes and excluded product @shipping-method @e2e", async () => {
  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithoutRates.id,
    SHIPPING_METHODS.shippingMethodWithoutRates.name,
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
  await shippingRatesPage.addExcludedProduct("Bean Juice");
  await shippingRatesPage.basePage.expectSuccessBanner();
  await shippingRatesPage.excludedProductsRows.waitFor({ state: "visible" });
  await expect(shippingRatesPage.excludedProductsRows).toContainText("Bean Juice");
});
test("TC: SALEOR_34 Delete a single shipping rate from the shipping zone details page @shipping-method @e2e", async () => {
  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.id,
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.name,
  );
  await expect(shippingMethodsPage.pageHeader).toBeVisible();

  const priceBasedRate =
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.rates.priceBasedRateToBeDeleted.name;

  await expect(shippingMethodsPage.priceBasedRatesSection).toContainText(priceBasedRate);
  await shippingMethodsPage.clickDeletePriceBasedShippingMethod();
  await shippingMethodsPage.deleteShippingMethodDialog.clickDeleteButton();
  await shippingMethodsPage.expectSuccessBanner();
  await expect(shippingMethodsPage.priceBasedRatesSection).toContainText("No shipping rates found");
  await expect(shippingMethodsPage.priceBasedRatesSection).not.toContainText(priceBasedRate);
});
test("TC: SALEOR_35 Delete a single shipping rate from its details page @shipping-method @e2e", async () => {
  const shippingMethodId = SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.id;
  const shippingRateId =
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.rates.weightBasedRateToBeDeleted.id;
  const weightBasedRate =
    SHIPPING_METHODS.shippingMethodWithRatesToBeDeleted.rates.weightBasedRateToBeDeleted.name;

  await shippingMethodsPage.gotoExistingShippingRate(shippingMethodId, shippingRateId);
  await shippingMethodsPage.clickDeleteShippingRateButton();
  await shippingMethodsPage.deleteShippingMethodDialog.clickDeleteButton();
  await shippingMethodsPage.expectSuccessBanner();
  await expect(shippingMethodsPage.weightBasedRatesSection).toContainText(
    "No shipping rates found",
  );
  await expect(shippingMethodsPage.weightBasedRatesSection).not.toContainText(weightBasedRate);
});
test("TC: SALEOR_36 Delete shipping zones in bulk @shipping-method @e2e", async () => {
  const shippingZone1 = SHIPPING_METHODS.shippingMethodToBeBulkDeleted1.name;
  const shippingZone2 = SHIPPING_METHODS.shippingMethodToBeBulkDeleted2.name;
  const shippingZone3 = SHIPPING_METHODS.shippingMethodToBeBulkDeleted3.name;

  await shippingMethodsPage.gotoListView();
  await shippingMethodsPage.checkListRowsBasedOnContainingText([
    shippingZone1,
    shippingZone2,
    shippingZone3,
  ]);
  await shippingMethodsPage.clickBulkDeleteGridRowsButton();
  await shippingMethodsPage.deleteShippingMethodDialog.clickDeleteButton();
  await shippingMethodsPage.expectSuccessBanner();
});
test("TC: SALEOR_37 Update a shipping method @shipping-method @e2e", async () => {
  const channelSection = shippingMethodsPage.rightSideDetailsPage.channelSection;
  const warehouseSection = shippingMethodsPage.rightSideDetailsPage.warehouseSection;
  const alreadyAssignedChannels = [CHANNELS.channelUSD.name];
  const channelsToBeAssigned = [CHANNELS.channelPLN.name];
  const alreadyAssignedWarehouses = [
    WAREHOUSES.warehouseOceania.name,
    WAREHOUSES.warehouseAfrica.name,
  ];
  const warehousesToBeAssigned = [
    WAREHOUSES.warehouseAmericas.name,
    WAREHOUSES.warehouseEurope.name,
  ];

  await shippingMethodsPage.gotoExistingShippingMethod(
    SHIPPING_METHODS.shippingMethodToBeUpdated.id,
    SHIPPING_METHODS.shippingMethodToBeUpdated.name,
  );

  await shippingMethodsPage.rightSideDetailsPage.expectOptionsSelected(
    channelSection,
    alreadyAssignedChannels,
  );
  await shippingMethodsPage.rightSideDetailsPage.clickChannelsSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.selectSingleChannelShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.expectOptionsSelected(
    warehouseSection,
    alreadyAssignedWarehouses,
  );

  await shippingMethodsPage.rightSideDetailsPage.clickWarehouseSelectShippingPage();
  await shippingMethodsPage.rightSideDetailsPage.typeAndSelectMultipleWarehousesShippingPage(
    warehousesToBeAssigned,
  );
  await shippingMethodsPage.saveShippingZone();
  await shippingMethodsPage.expectSuccessBanner();

  const updatedChannelsList = alreadyAssignedChannels.concat(channelsToBeAssigned);

  await shippingMethodsPage.rightSideDetailsPage.expectOptionsSelected(
    channelSection,
    updatedChannelsList,
  );

  const updatedWarehousesList = alreadyAssignedWarehouses.concat(warehousesToBeAssigned);

  await shippingMethodsPage.rightSideDetailsPage.expectOptionsSelected(
    warehouseSection,
    updatedWarehousesList,
  );
});
