import { Page } from "@playwright/test";

export class AssignProductsDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly productRow = page.getByTestId("product-row"),
    readonly backButton = page.getByTestId("back"),
    readonly assignButton = page.getByTestId("assign-and-save-button"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    readonly searchInput = page.getByTestId("search-bar").locator("input"),
  ) {
    this.page = page;
  }

  async clickAssignButton() {
    await this.assignButton.click();
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async searchForProductInDialog(productName: string) {
    await this.searchInput.fill(productName);
  }

  async selectProduct(name: string) {
    const product = this.productRow.filter({ hasText: name });

    await product.waitFor({ state: "visible" });
    await product.getByRole("checkbox").click();
  }
}
