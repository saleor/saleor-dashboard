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
  const currentStockReservationForAuthUser =
    await orderSettingsPage.stockReservationForAuthUserInput.inputValue();
  const currentStockReservationForAnonUser =
    await orderSettingsPage.stockReservationForAnonUserInput.inputValue();
  const currentCheckoutLineLimit = await orderSettingsPage.checkoutLineLimitInput.inputValue();
  const newStockReservationForAuthUser =
    currentStockReservationForAuthUser === "200" ? "201" : "200";
  const newStockReservationForAnonUser =
    currentStockReservationForAnonUser === "400" ? "401" : "400";
  const newCheckoutLineLimit = currentCheckoutLineLimit === "70" ? "71" : "70";

  await orderSettingsPage.fillStockReservationForAuthUser(newStockReservationForAuthUser);
  await orderSettingsPage.fillStockReservationForAnonUser(newStockReservationForAnonUser);
  await orderSettingsPage.fillCheckoutLineLimitInput(newCheckoutLineLimit);
  await orderSettingsPage.saveButton.click();
  await orderSettingsPage.expectSuccessBanner();
  await expect(orderSettingsPage.stockReservationForAuthUserInput).toHaveValue(
    newStockReservationForAuthUser,
  );
  await expect(orderSettingsPage.stockReservationForAnonUserInput).toHaveValue(
    newStockReservationForAnonUser,
  );
  await expect(orderSettingsPage.checkoutLineLimitInput).toHaveValue(newCheckoutLineLimit);
});
