import type { Locator, Page } from "@playwright/test";

export class DeleteChannelDialog {
  readonly page: Page;

  readonly deleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.deleteButton = page.getByTestId("submit");
  }

  async clickDeleteButton() {
    await this.deleteButton.first().click();
    await this.deleteButton.waitFor({ state: "hidden" });
  }
}
