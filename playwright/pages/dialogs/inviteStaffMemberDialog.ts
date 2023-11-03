import type { Locator, Page } from "@playwright/test";

export class InviteStaffMembersDialog {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly sendInviteButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId("first-name-input").locator("input");
    this.lastNameInput = page.getByTestId("last-name-input").locator("input");
    this.emailInput = page.getByTestId("email-input").locator("input");
    this.sendInviteButton = page.getByTestId("submit");
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
