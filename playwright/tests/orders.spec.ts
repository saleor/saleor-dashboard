import { URL_LIST } from "@data/url";
import { HomePage } from "@pages/home-page";
import {
  expect,
  test,
} from "@playwright/test";

test.use({ storageState: "playwright/.auth/admin.json" });

test("Orders", async ({ page }) => {
  await page.goto(URL_LIST.orders);
  const homePage = new HomePage(page);
  await expect(page.getByTestId("create-order-button")).toBeVisible();
});
