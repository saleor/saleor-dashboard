import type { Locator, Page } from "@playwright/test";

export class DeleteProductDialog {
  readonly page: Page;

  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.deleteButton = page.getByTestId("submit");
  }

  async clickDeleteButton() {
    await this.deleteButton.first().click();
  }
}
