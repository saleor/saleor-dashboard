import { MailpitService } from "@api/mailpit";
import type { APIRequestContext, Page } from "@playwright/test";

export class SetUpNewPasswordPage {
  readonly page: Page;

  readonly mailpitService: MailpitService;

  constructor(
    page: Page,
    request: APIRequestContext,
    readonly passwordInput = page.getByTestId("password"),
    readonly confirmPasswordInput = page.getByTestId("confirm-password"),
    readonly setNewPasswordButton = page.getByTestId("button-bar-confirm"),
  ) {
    this.page = page;
    this.mailpitService = new MailpitService(request);
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
    const resetPasswordPageUrl = await this.mailpitService.generateResetPasswordUrl(userEmail);

    await this.page.goto(resetPasswordPageUrl);
  }
}
