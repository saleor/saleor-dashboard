import type { Locator, Page } from "@playwright/test";

export class AddValueDialog {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByTestId("value-name").locator("input");
    this.saveButton = page.getByTestId("submit");
  }

  async typeAndSaveAttributeValue(value = "XXL") {
    await this.nameInput.fill(value);
    await this.saveButton.click();
  }
}
