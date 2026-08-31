import type { Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class InviteStaffMembersDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly firstNameInput = inputByTestId(page, "first-name-input"),
    readonly lastNameInput = inputByTestId(page, "last-name-input"),
    readonly emailInput = inputByTestId(page, "email-input"),
    readonly sendInviteButton = page.getByTestId("submit"),
    readonly inviteStaffMemberDialogForm = page.getByTestId("invite-staff-member-dialog-form"),
  ) {
    this.page = page;
  }

  async clickSendInviteButton() {
    await this.sendInviteButton.click();
  }

  async typeNameLastNameAndEmail(name: string, lastName: string, email: string) {
    await this.firstNameInput.fill(name);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
  }
}
