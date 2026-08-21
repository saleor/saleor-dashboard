import type { Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class AddValueDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly nameInput = inputByTestId(page, "value-name"),
    readonly saveButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async typeAndSaveAttributeValue(value = "XXL") {
    await this.nameInput.fill(value);
    await this.saveButton.click();
  }
}
