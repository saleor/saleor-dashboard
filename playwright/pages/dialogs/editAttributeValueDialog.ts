import type { Page } from "@playwright/test";
import faker from "faker";
import { inputByTestId } from "utils/locators";

export class EditAttributeValueDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly saveButton = page.getByTestId("submit"),
    readonly cancelButton = page.getByTestId("back"),
    readonly valueInput = inputByTestId(page, "value-name"),
  ) {
    this.page = page;
  }

  async provideNewAttributeValue(newValue: string = faker.lorem.word(5)) {
    await this.valueInput.clear();
    await this.valueInput.fill(newValue);
  }

  async saveNewAttributeValue() {
    await this.saveButton.click();
  }
}
