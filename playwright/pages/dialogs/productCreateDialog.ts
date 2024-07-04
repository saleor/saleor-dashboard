import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class ProductCreateDialog extends BasePage {
  constructor(
    page: Page,
    readonly dialogProductTypeInput = page.locator("[data-test-id='dialog-product-type'] input"),
    readonly promptedOptions = page.getByTestId("select-option"),
    readonly dropdown = page.getByTestId("autocomplete-dropdown"),
    readonly confirmButton = page.getByTestId("submit"),
    readonly tooltipResult = page.getByRole("tooltip"),
  ) {
    super(page);
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
