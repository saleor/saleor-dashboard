import { MailpitService } from "@api/mailpit";
import type { APIRequestContext, Locator, Page } from "@playwright/test";

export class SetUpNewPasswordPage {
  readonly page: Page;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly setNewPasswordButton: Locator;
  readonly mailpitService: MailpitService;

  constructor(page: Page, request: APIRequestContext) {
    this.page = page;
    this.mailpitService = new MailpitService(request);
    this.passwordInput = page.getByTestId("password");
    this.confirmPasswordInput = page.getByTestId("confirm-password");
    this.setNewPasswordButton = page.getByTestId("button-bar-confirm");
  }

  async typePassword(password: string) {
    await this.passwordInput.fill(password);
  }
  async typeConfirmedPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }
  async clickSetNewPasswordButton() {
    await this.setNewPasswordButton.click();
  }

  async gotoUserResetPasswordPage(userEmail: string) {
    const resetPasswordPageUrl =
      await this.mailpitService.generateResetPasswordUrl(userEmail);
    await this.page.goto(resetPasswordPageUrl);
  }
}
