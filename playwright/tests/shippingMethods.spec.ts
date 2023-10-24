import { ShippingMethodsPage } from "@pages/shippingMethodsPage";
import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_31 Create basic shipping method @shipping-method @basic-regression", async ({
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
