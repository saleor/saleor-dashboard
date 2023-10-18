import { URL_LIST } from "@data/url";
import { OrdersPage } from "@pages/ordersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_28 Create basic order @basic-regression @order", async ({
  page,
}) => {
  const ordersPage = new OrdersPage(page);

  await page.goto(URL_LIST.orders);
  await ordersPage.clickCreateOrderButton();
  await ordersPage.orderCreateDialog.completeOrderCreateDialogWithFirstChannel();
  await ordersPage.clickAddOrderButton();
  await ordersPage.addProductsDialog.selectVariantOnListAndConfirm();
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
  await ordersPage.basePage.expectSuccessBannerMessage("finalize");
});
