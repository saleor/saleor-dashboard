import { OrderSettingsPage } from "@pages/orderSettingsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let orderSettingsPage: OrderSettingsPage;

test.beforeEach(({ page }) => {
  orderSettingsPage = new OrderSettingsPage(page);
});

test("TC: SALEOR_132B Should be able to update checkout stock settings on orders hub #e2e", async () => {
  await orderSettingsPage.gotoOrderSettings();
  await orderSettingsPage.fillStockReservationForAuthUser("200");
  await orderSettingsPage.fillStockReservationForAnonUser("400");
  await orderSettingsPage.fillCheckoutLineLimitInput("70");
  await orderSettingsPage.saveButton.click();
  await orderSettingsPage.expectSuccessBanner();
  await expect(orderSettingsPage.stockReservationForAuthUserInput).toHaveValue("200");
  await expect(orderSettingsPage.stockReservationForAnonUserInput).toHaveValue("400");
  await expect(orderSettingsPage.checkoutLineLimitInput).toHaveValue("70");
});
