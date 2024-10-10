import { BasePage } from "@pages/basePage";
import { DiscountsPage } from "@pages/discountsPage";
import { HomePage } from "@pages/homePage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { VouchersPage } from "@pages/vouchersPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "discount" });

let mainMenuPage: MainMenuPage;
let home: HomePage;
let basePage: BasePage;
let discountsPage: DiscountsPage;
let vouchersPage: VouchersPage;

test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  home = new HomePage(page);
  basePage = new BasePage(page);
  discountsPage = new DiscountsPage(page);
  vouchersPage = new VouchersPage(page);
});
test.beforeEach(async ({ page }) => {
  mainMenuPage = new MainMenuPage(page);
  home = new HomePage(page);
  basePage = new BasePage(page);
  discountsPage = new DiscountsPage(page);
  vouchersPage = new VouchersPage(page);
  await home.goto();
  await home.welcomeMessage.waitFor({ state: "visible", timeout: 30000 });
});
test("TC: SALEOR_6 User should be able to navigate to discount list as a staff member using DISCOUNTS permission @e2e", async () => {
  await mainMenuPage.openDiscounts();
  await basePage.waitForGrid();
  await expect(discountsPage.createDiscountButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(4);
});
test("TC: SALEOR_7 User should be able to navigate to voucher list as a staff member using DISCOUNTS permission @e2e", async () => {
  await mainMenuPage.openVouchers();
  await basePage.waitForGrid();
  await expect(vouchersPage.createVoucherButton).toBeVisible();
  await mainMenuPage.expectMenuItemsCount(4);
});
