import type { Page } from "@playwright/test";
import {expect} from "@playwright/test";

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
    readonly dropdown = page.getByTestId("autocomplete-dropdown"),
    readonly confirmButton = page.getByTestId("submit"),
    readonly tooltipResult = page.getByRole("tooltip"),
  ) {
    this.page = page;
  }
  async selectProductTypeWithVariants(productType: string = "Beer") {
    const responsePromise = this.page.waitForResponse('**/graphql/');
    await this.dialogProductTypeInput.fill(productType);
    await responsePromise;
    await this.promptedOptions.filter({hasText:productType}).click();
  }
  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
