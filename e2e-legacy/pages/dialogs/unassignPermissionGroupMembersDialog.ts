import type { Page } from "@playwright/test";

export class UnassignPermissionGroupMembersDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly unassignButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async clickConfirmUnassignButton() {
    await this.unassignButton.click();
  }
}
