import type { Page } from "@playwright/test";

export class ProductCreateDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly dialogProductTypeInput = page.locator(
      "[data-test-id='dialog-product-type'] input",
    ),
    readonly promptedOptions = page.getByTestId(
      "single-autocomplete-select-option",
    ),
    readonly confirmButton = page.getByTestId("submit"),
  ) {
    this.page = page;
  }
  async selectProductTypeWithVariants() {
    await this.dialogProductTypeInput.fill("beer");
    await this.promptedOptions.filter({ hasText: "Beer" }).first().click();
    await this.confirmButton.waitFor({ state: "visible", timeout: 30000});
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
