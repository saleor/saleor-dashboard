import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class DeleteDialog extends BasePage {

  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId("submit"),
    readonly confirmDeletionCheckbox = page.locator(
      "[name='delete-assigned-items-consent']",
    ),
    readonly confirmDeleteButton = page.getByTestId("submit")
  ) {
     super(page);
  }

  async clickDeleteButton() {
    await this.deleteButton.first().click();
    await this.deleteButton.waitFor({ state: "hidden" });
  }
  async clickConfirmDeletionCheckbox() {
    await this.confirmDeletionCheckbox.click();
  }

  async clickConfirmDeleteButton() {
    await this.confirmDeleteButton.click();
    await this.confirmDeleteButton.waitFor({ state: "hidden" });
  }
}
