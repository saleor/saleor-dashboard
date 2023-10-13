import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { CustomersPage } from "@pages/customersPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect, test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/customer.json" });

test("TC: SALEOR_13 User should be able to navigate to customer list as a staff member using CUSTOMER permission", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const customersPage = new CustomersPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openCustomers();
  await expect(customersPage.createCustomerButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(2);
});
