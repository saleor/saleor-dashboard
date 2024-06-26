import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class AssignProductsDialog extends BasePage {
  constructor(
    page: Page,
    readonly productRow = page.getByTestId("product-row"),
    readonly backButton = page.getByTestId("back"),
    readonly assignButton = page.getByTestId("assign-and-save-button"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    readonly searchInput = page.getByTestId("search-bar").locator("input"),
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
