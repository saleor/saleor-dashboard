import { HomePage } from "@pages/homePage";
import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  homePage: HomePage;
  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.signInButton = page.getByTestId("submit");
  }

  async loginAndSetStorageState(
    userEmail: string,
    userPassword: string,
    page: Page,
    path: string,
  ) {
    await page.goto(process.env.BASE_URL!);
    await this.typeEmail(userEmail);
    await this.typePassword(userPassword);
    await this.clickSignInButton();
    await expect(this.homePage.welcomeMessage).toContainText("Hello there,");
    // End of authentication steps.
    await page.context().storageState({ path });
  }
  async typeEmail(email: string) {
    await this.emailInput.fill(email);
  }
  async typePassword(password: string) {
    await this.passwordInput.fill(password);
  }
  async clickSignInButton() {
    await this.signInButton.click();
  }
}
