import { ChangePasswordDialog } from "@dialogs/changePasswordDialog";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class AccountSettingsPage {
  readonly page: Page;
  readonly basePage: BasePage;

  readonly changePasswordDialog: ChangePasswordDialog;

  constructor(
    page: Page,
    readonly changePasswordButton = page.getByTestId("changePasswordBtn"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
  ) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.changePasswordDialog = new ChangePasswordDialog(page);
  }

  async clickChangePasswordButton() {
    await this.changePasswordButton.click();
  }

  async typeOldAndNewPasswords(oldPassword: string, newPassword: string) {
    await this.changePasswordDialog.typeOldPassword(oldPassword);
    await this.changePasswordDialog.typeNewPassword(newPassword);
  }

  async clickSaveChangedPasswordButton() {
    await this.changePasswordDialog.clickSaveButton();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
}
