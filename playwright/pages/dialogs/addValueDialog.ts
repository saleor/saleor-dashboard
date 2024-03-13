import type { Page } from "@playwright/test";

export class AddValueDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly nameInput = page.getByTestId("value-name").locator("input"),
    readonly saveButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async typeAndSaveAttributeValue(value: string = "XXL") {
    await this.nameInput.fill(value);
    await this.saveButton.click();
  }
}
