import type { Page } from "@playwright/test";

export class DeleteDiscountDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId(
      "delete-confirmation-button",
    ),
  ) {
    this.page = page;
  }

  async clickConfirmDeleteButton() {
    await this.deleteButton.click();
  }
}
