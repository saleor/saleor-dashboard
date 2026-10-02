import type { Page } from "@playwright/test";

export class AddVoucherCodeDialog {
  constructor(
    page: Page,
    readonly quantityInput = page.getByTestId("quantity-input"),
    readonly prefixInput = page.getByTestId("prefix-input"),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly enterCodeInput = page.getByTestId("enter-code-input"),
  ) {}

  async typeCodesQuantity(quantity = "10") {
    await this.quantityInput.fill(quantity);
  }

  async typeCodesPrefix(prefix = "automation") {
    await this.prefixInput.fill(prefix);
  }

  async typeCode(code = "123456789") {
    await this.enterCodeInput.fill(code);
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }
}
