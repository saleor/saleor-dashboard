import type { Page } from "@playwright/test";

export class ChangePasswordDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly saveButton = page.getByTestId("submit"),
    readonly newPasswordInput = page
      .getByTestId("new-password-input")
      .locator("input"),
    readonly oldPasswordInput = page
      .getByTestId("old-password-input")
      .locator("input"),
  ) {
    this.page = page;
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async typeNewPassword(newPassword: string) {
    await this.newPasswordInput.fill(newPassword);
  }

  async typeOldPassword(oldPassword: string) {
    await this.oldPasswordInput.fill(oldPassword);
  }
}
