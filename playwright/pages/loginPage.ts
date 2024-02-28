import { HomePage } from "@pages/homePage";
import { expect, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly homePage: HomePage;
  constructor(
    page: Page,
    readonly emailInput = page.getByTestId("email"),
    readonly passwordInput = page.getByTestId("password"),
    readonly signInButton = page.getByTestId("submit"),
    readonly resetPasswordLink = page.getByTestId("reset-password-link"),
    readonly sendEmailWithResetLinkButton = page.getByTestId("submit"),
    readonly backToLoginPageButton = page.getByTestId("back-to-login-button"),
  ) {
    this.page = page;
    this.homePage = new HomePage(page);
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
    await expect(this.homePage.welcomeMessage).toContainText("Hello there,", {
      timeout: 15000
    });
    // End of authentication steps.
    await page.context().storageState({ path });
  }

  async typeEmail(email: string) {
    await this.emailInput.waitFor({state: "visible", timeout:15000})
    await this.emailInput.fill(email);
  }
  async typePassword(password: string) {
    await this.passwordInput.fill(password);
  }
  async clickSignInButton() {
    await this.signInButton.click();
  }
}
