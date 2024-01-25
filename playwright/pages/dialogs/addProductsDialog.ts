import { expect, Page } from "@playwright/test";

export class AddProductsDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly productRow = page.getByTestId("product"),
    readonly variantRow = page.getByTestId("variant"),
    readonly backButton = page.getByTestId("back-button"),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly productRowCheckbox = page.getByTestId("checkbox"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
  ) {
    this.page = page;
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }
  async clickBackButton() {
    await this.confirmButton.click();
  }

  async selectVariantWithSkuOnListAndConfirm(variantSku = "61630747") {
    await this.variantRow
      .filter({ has: this.page.locator(`text=SKU ${variantSku}`) })
      .locator(this.productRowCheckbox)
      .click();
    await this.clickConfirmButton();
    await expect(this.productRow.first()).not.toBeVisible();
  }
}
