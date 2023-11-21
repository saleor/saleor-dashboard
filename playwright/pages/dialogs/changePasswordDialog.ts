import type { Locator, Page } from "@playwright/test";

export class ChangePasswordDialog {
  readonly page: Page;
  readonly newPasswordInput: Locator;
  readonly oldPasswordInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saveButton = page.getByTestId("submit");
    this.newPasswordInput = page
      .getByTestId("new-password-input")
      .locator("input");
    this.oldPasswordInput = page
      .getByTestId("old-password-input")
      .locator("input");
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
