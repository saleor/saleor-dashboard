import type { Page } from "@playwright/test";

export class DeleteCategoriesDialog {
  readonly page: Page;

  constructor(page: Page, readonly deleteButton = page.getByTestId("submit")) {
    this.page = page;
  }

  async clickDeleteButton() {
    await this.deleteButton.first().click();
    await this.deleteButton.waitFor({ state: "hidden" });
  }
}
