import { ORDERS, PRODUCTS } from "@data/e2eTestData";
import { FulfillmentPage } from "@pages/fulfillmentPage";
import { OrdersPage } from "@pages/ordersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });
let ordersPage: OrdersPage;
let fulfillmentPage: FulfillmentPage;

test.beforeEach(({ page }) => {
  ordersPage = new OrdersPage(page);
  fulfillmentPage = new FulfillmentPage(page);
});

test("TC: SALEOR_28 Create basic order @e2e @order", async () => {
  await ordersPage.goToOrdersListView();
  await ordersPage.clickCreateOrderButton();
  await ordersPage.orderCreateDialog.completeOrderCreateDialogWithFirstChannel();
  await ordersPage.clickAddProductsButton();
  await ordersPage.addProductsDialog.selectVariantWithSkuOnListAndConfirm();
  await ordersPage.clickEditCustomerButton();
  await ordersPage.clickSearchCustomerInput();
  await ordersPage.selectCustomer();
  await expect(
    ordersPage.addressDialog.existingAddressRadioButton,
  ).toBeVisible();
  await ordersPage.addressDialog.clickConfirmButton();
  await ordersPage.clickAddShippingCarrierButton();
  await ordersPage.shippingAddressDialog.pickAndConfirmFirstShippingMethod();
  await ordersPage.clickFinalizeButton();
  await ordersPage.successBanner
    .filter({ hasText: "finalized" })
    .waitFor({ state: "visible" });
});
test("TC: SALEOR_76 Create order with transaction flow activated @e2e @order", async () => {
  await ordersPage.goToOrdersListView();
  await ordersPage.clickCreateOrderButton();
  await ordersPage.orderCreateDialog.completeOrderCreateDialogWithTransactionChannel();
  await ordersPage.clickAddProductsButton();
  await ordersPage.addProductsDialog.selectVariantWithSkuOnListAndConfirm(
    PRODUCTS.productAvailableWithTransactionFlow.variant1sku,
  );
  await ordersPage.clickEditCustomerButton();
  await ordersPage.clickSearchCustomerInput();
  await ordersPage.selectCustomer();
  await expect(
    ordersPage.addressDialog.existingAddressRadioButton,
  ).toBeVisible();
  await ordersPage.addressDialog.clickConfirmButton();
  await ordersPage.clickAddShippingCarrierButton();
  await ordersPage.shippingAddressDialog.pickAndConfirmFirstShippingMethod();
  await ordersPage.clickFinalizeButton();
  await ordersPage.successBanner
    .filter({ hasText: "finalized" })
    .waitFor({ state: "visible" });
  await expect(ordersPage.markAsPaidButton).toBeVisible();
  await expect(ordersPage.paymentSummarySection).toBeVisible();
  await expect(ordersPage.orderSummarySection).toBeVisible();
  await expect(ordersPage.fulfillButton).toBeDisabled();
});

test("TC: SALEOR_77 Mark order as paid and fulfill it with transaction flow activated @e2e @order", async () => {
  await ordersPage.goToExistingOrderPage(
    ORDERS.ordersWithinTransactionFlow.singleVariant.id,
  );
  await ordersPage.waitForGrid();
  await ordersPage.clickMarkAsPaidButton();
  await ordersPage.markOrderAsPaidDialog.typeAndSaveOrderReference();
  await ordersPage.expectSuccessBannerMessage("paid");
  const transactionsMadeRows = await ordersPage.orderTransactionsList.locator(
    "tr",
  );
  expect(await transactionsMadeRows.count()).toEqual(1);
  await expect(transactionsMadeRows).toContainText("Success");
  await ordersPage.clickFulfillButton();
  await fulfillmentPage.clickFulfillButton();
  await ordersPage.expectSuccessBannerMessage("fulfilled");
  expect(await ordersPage.pageHeaderStatusInfo).toContainText("Fulfilled");
});
