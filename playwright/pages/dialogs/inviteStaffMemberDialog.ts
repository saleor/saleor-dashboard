import type { Page } from "@playwright/test";

export class InviteStaffMembersDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly firstNameInput = page
      .getByTestId("first-name-input")
      .locator("input"),
    readonly lastNameInput = page
      .getByTestId("last-name-input")
      .locator("input"),
    readonly emailInput = page.getByTestId("email-input").locator("input"),
    readonly sendInviteButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async clickSendInviteButton() {
    await this.sendInviteButton.click();
  }

  async typeNameLastNameAndEmail(
    name: string,
    lastName: string,
    email: string,
  ) {
    await this.firstNameInput.fill(name);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.sendInviteButton.click();
  }
}
