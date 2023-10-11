import type { Locator, Page } from "@playwright/test";

export class StaffMembersPage {
  readonly page: Page;
  readonly inviteStaffMembersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inviteStaffMembersButton = page.getByTestId("invite-staff-member");
  }
}
