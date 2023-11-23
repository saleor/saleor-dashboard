import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";
import { ChangePasswordDialog } from "./dialogs/changePasswordDialog";

export class AccountSettingsPage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly changePasswordButton: Locator;
  readonly saveButton: Locator;
  readonly changePasswordDialog: ChangePasswordDialog;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.changePasswordDialog = new ChangePasswordDialog(page);
    this.changePasswordButton = page.getByTestId("changePasswordBtn");
    this.saveButton = page.getByTestId("button-bar-confirm");
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
