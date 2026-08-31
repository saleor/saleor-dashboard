import type { Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class ChangePasswordDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly saveButton = page.getByTestId("submit"),
    readonly newPasswordInput = inputByTestId(page, "new-password-input"),
    readonly oldPasswordInput = inputByTestId(page, "old-password-input"),
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
