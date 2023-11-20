import { HomePage } from "@pages/homePage";
import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly resetPasswordLink: Locator;
  readonly sendEmailWithResetLinkButton: Locator;
  readonly backToLoginPageButton: Locator;
  homePage: HomePage;
  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page);
    this.emailInput = page.getByTestId("email");
    this.passwordInput = page.getByTestId("password");
    this.signInButton = page.getByTestId("submit");
    this.resetPasswordLink = page.getByTestId("reset-password-link");
    this.sendEmailWithResetLinkButton = page.getByTestId("submit");
    this.backToLoginPageButton = page.getByTestId("back-to-login-button");
  }

  async clickBackToLoginPageButton() {
    await this.backToLoginPageButton.click();
  }
  async clickResetPasswordLink() {
    await this.resetPasswordLink.click();
  }
  async clickSendEmailWithResetLinkButton() {
    await this.sendEmailWithResetLinkButton.click();
  }

  async loginAndSetStorageState(
    userEmail: string,
    userPassword: string,
    page: Page,
    path: string,
  ) {
    await this.page.goto(process.env.BASE_URL!);
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
