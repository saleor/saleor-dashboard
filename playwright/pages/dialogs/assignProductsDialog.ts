import { BasePage } from "@pages/basePage";
import { expect, type Page } from "@playwright/test";

export class AssignProductsDialog extends BasePage {
  constructor(
    page: Page,
    readonly productRow = page.getByTestId("assign-product-table-row"),
    readonly backButton = page.getByTestId("back"),
    readonly assignButton = page.getByTestId("submit"),
    readonly assignAndSaveButton = page.getByTestId("submit"),
    readonly searchInput = page.getByTestId("product-search-input").locator("input"),
  ) {
    super(page);
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

    await product.getByRole("checkbox").waitFor({ state: "visible" });
    await expect(product.getByRole("checkbox")).toBeEnabled();

    await product.getByRole("checkbox").click();
    await this.waitForDOMToFullyLoad();
    await expect(product.getByRole("checkbox")).toBeChecked();
  }
}
