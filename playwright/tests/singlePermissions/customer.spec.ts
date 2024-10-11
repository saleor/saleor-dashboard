import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { CustomersPage } from "@pages/customersPage";
import { MainMenuPage } from "@pages/mainMenuPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "customer" });

test("TC: SALEOR_13 User should be able to navigate to customer list as a staff member using CUSTOMER permission @e2e", async ({
  page,
}) => {
  const basePage = new BasePage(page);
  const mainMenuPage = new MainMenuPage(page);
  const customersPage = new CustomersPage(page);

  await page.goto(URL_LIST.homePage);
  await mainMenuPage.openCustomers();
  await expect(customersPage.createCustomerButton).toBeVisible();
  await basePage.expectGridToBeAttached();
  await mainMenuPage.expectMenuItemsCount(3);
});
