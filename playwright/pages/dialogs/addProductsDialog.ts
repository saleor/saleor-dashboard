import { expect, Locator, Page } from "@playwright/test";

export class AddProductsDialog {
  readonly page: Page;
  readonly productRow: Locator;
  readonly variantRow: Locator;
  readonly productRowCheckbox: Locator;
  readonly backButton: Locator;
  readonly confirmButton: Locator;
  readonly assignAndSaveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productRow = page.getByTestId("product");
    this.variantRow = page.getByTestId("variant");
    this.backButton = page.getByTestId("back-button");
    this.confirmButton = page.getByTestId("confirm-button");
    this.productRowCheckbox = page.getByTestId("checkbox");
    this.assignAndSaveButton = page.getByTestId("assign-and-save-button");
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
