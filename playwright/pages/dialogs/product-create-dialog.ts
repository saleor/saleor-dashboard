import type { Locator, Page } from "@playwright/test";

export class ProductCreateDialog {
  readonly page: Page;
  readonly dialogProductTypeInput: Locator;
  readonly promptedOptions: Locator;
  readonly confirmButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.dialogProductTypeInput = page.locator(
      "[data-test-id='dialog-product-type'] input",
    );
    this.promptedOptions = page.getByTestId(
      "single-autocomplete-select-option",
    );
    this.confirmButton = page.getByTestId("submit");
  }
  async selectProductTypeWithVariants() {
    await this.dialogProductTypeInput.fill("beer");
    await this.promptedOptions.filter({ hasText: "Beer" }).click();
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
