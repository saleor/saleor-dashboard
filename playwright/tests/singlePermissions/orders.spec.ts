import { DraftOrdersPage } from "@pages/draftOrdersPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { OrdersPage } from "@pages/ordersPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "order" });

let home: HomePage;
let draftOrdersPage: DraftOrdersPage;
let ordersPage: OrdersPage;
let mainMenuPage: MainMenuPage;

test.beforeEach(async ({ page }) => {
  draftOrdersPage = new DraftOrdersPage(page);
  home = new HomePage(page);
  ordersPage = new OrdersPage(page);
  draftOrdersPage = new DraftOrdersPage(page);
  mainMenuPage = new MainMenuPage(page);
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
});
test("TC: SALEOR_8 User should be able to navigate to order list as a staff member using ORDER permission @e2e", async () => {
  await mainMenuPage.openOrders();
  await expect(ordersPage.createOrderButton).toBeVisible();
  await ordersPage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(4);
});
test("TC: SALEOR_9 User should be able to navigate to draft list as a staff member using ORDER permission @e2e", async () => {
  await mainMenuPage.openDrafts();
  await expect(draftOrdersPage.createDraftOrderButton).toBeVisible();
  await draftOrdersPage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(4);
});
