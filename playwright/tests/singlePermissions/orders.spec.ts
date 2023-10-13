import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DraftsPage } from "@pages/draftsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { OrdersPage } from "@pages/ordersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/orders.json" });

test("TC: SALEOR_8 User should be able to navigate to order list as a staff member using ORDER permission", async ({
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
test("TC: SALEOR_9 User should be able to navigate to draft list as a staff member using ORDER permission", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const draftsPage = new DraftsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openDrafts();
  await expect(draftsPage.createDraftButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(3);
});
