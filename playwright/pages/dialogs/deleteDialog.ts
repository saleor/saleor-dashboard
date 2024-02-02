import type { Page } from "@playwright/test";
import { isArray } from "lodash";

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
    await this.deleteButton.first().click();
  }
  async clickConfirmDeletionCheckbox() {
    await this.confirmDeletionCheckbox.click();
  }
}
