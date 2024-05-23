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

  async selectProductTypeWithVariants(productType = "Beer") {
    await this.waitForNetworkIdleAfterAction(() => this.dialogProductTypeInput.fill(productType));
    await this.promptedOptions.filter({ hasText: productType }).waitFor({ state: "attached" });
    await this.promptedOptions.filter({ hasText: productType }).click();
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
