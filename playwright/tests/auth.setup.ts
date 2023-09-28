import { HomePage } from "@pages/home-page";
import { LoginPage } from "@pages/login-page";
import {
  expect,
  test as setup,
} from "@playwright/test";

const adminFile = "playwright/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.typeEmail(process.env.CYPRESS_USER_NAME!);
  await loginPage.typePassword(process.env.CYPRESS_USER_PASSWORD!);
  await loginPage.clickSignInButton();

  const homePage = new HomePage(page);
  await expect(homePage.welcomeMessage).toContainText("Hello there,");

  // End of authentication steps.
  await page.context().storageState({ path: adminFile });
});
