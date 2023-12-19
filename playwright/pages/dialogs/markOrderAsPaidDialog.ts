import type { Page } from "@playwright/test";

export class MarkOrderAsPaidDialog {
  constructor(
    page: Page,
    readonly transactionReferenceInput = page
      .getByTestId("transaction-reference-input")
      .locator("input"),
    readonly confirmButton = page.getByTestId("submit"),
  ) {}

  async typeAndSaveOrderReference(value = "09728937896253") {
    await this.transactionReferenceInput.fill(value);
    await this.confirmButton.click();
    await this.transactionReferenceInput.waitFor({ state: "hidden" });
  }
}
