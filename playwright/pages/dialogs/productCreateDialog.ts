import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

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
  async selectProductTypeWithVariants(productType: string = "Beer") {
    await this.dialogProductTypeInput.fill(productType);
    await this.promptedOptions.filter({ hasText: productType }).first().click();
    await this.promptedOptions.waitFor({ state: "hidden", timeout: 30000});
    await this.confirmButton.waitFor({ state: "visible", timeout: 30000});
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
