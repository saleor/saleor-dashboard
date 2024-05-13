import { Page } from "@playwright/test";

export class ExportGiftCardsDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly submitButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }

  async exportGiftCardCodes(fileExtension: string) {
    const fileExtensionCheckbox = this.page.getByTestId(fileExtension);

    await fileExtensionCheckbox.click();
    await this.submitButton.click();
    await this.submitButton.waitFor({ state: "hidden" });
  }
}
