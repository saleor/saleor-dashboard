import type { Page } from "@playwright/test";

export class DeleteRuleDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly deleteRuleButton = page.getByTestId("delete-rule-button"),
    readonly cancelButton = page.getByTestId("cancel-delete-rule-button"),
  ) {
    this.page = page;
  }

  async clickConfirmDeleteButton() {
    await this.deleteRuleButton.click();
  }

  async cancelDeletion() {
    await this.cancelButton.click();
  }
}
