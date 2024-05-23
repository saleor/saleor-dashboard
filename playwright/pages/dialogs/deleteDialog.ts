import type { Page } from "@playwright/test";

export class DeleteDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId("submit"),
    readonly confirmDeletionCheckbox = page.locator(
      "[name='delete-assigned-items-consent']",
    ),
  ) {
    this.page = page;
  }

  async clickDeleteButton() {
    await this.waitForNetworkIdleAfterAction(async () => {
      await this.deleteButton.first().click();
    });
    await this.deleteButton.waitFor({ state: "hidden" });
  }
  async clickConfirmDeletionCheckbox() {
    await this.confirmDeletionCheckbox.click();
  }
}
