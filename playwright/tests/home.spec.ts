import { URL_LIST } from "@data/url";
import { OrdersPage } from "@pages/ordersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("TC: SALEOR_xxx Grid playground @basic-regression", async ({ page }) => {
  const ordersPage = new OrdersPage(page);

  await page.goto(URL_LIST.orders);
  await expect(ordersPage.createOrderButton).toBeVisible();
});
