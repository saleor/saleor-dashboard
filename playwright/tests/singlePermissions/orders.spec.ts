import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DraftOrdersPage } from "@pages/draftOrdersPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { OrdersPage } from "@pages/ordersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/order.json" });

test("TC: SALEOR_8 User should be able to navigate to order list as a staff member using ORDER permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const ordersPage = new OrdersPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openOrders();
  await expect(ordersPage.createOrderButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(3);
});
test("TC: SALEOR_9 User should be able to navigate to draft list as a staff member using ORDER permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const draftOrdersPage = new DraftOrdersPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openDrafts();
  await expect(draftOrdersPage.createDraftOrderButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(3);
});
