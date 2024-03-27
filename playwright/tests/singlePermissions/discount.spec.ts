import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DiscountsPage } from "@pages/discountsPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { VouchersPage } from "@pages/vouchersPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/discount.json" });

test("TC: SALEOR_6 User should be able to navigate to discount list as a staff member using DISCOUNTS permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const discountsPage = new DiscountsPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openDiscounts();
  await expect(discountsPage.createDiscountButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(4);
});

test("TC: SALEOR_7 User should be able to navigate to voucher list as a staff member using DISCOUNTS permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const vouchersPage = new VouchersPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openVouchers();
  await expect(vouchersPage.createVoucherButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(4);
});
