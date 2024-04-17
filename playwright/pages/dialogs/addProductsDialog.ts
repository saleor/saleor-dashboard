import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class AddProductsDialog extends BasePage {
  constructor(
    page: Page,
    readonly productRow = page.getByTestId("product"),
    readonly variantRow = page.getByTestId("variant"),
    readonly backButton = page.getByTestId("back-button"),
    readonly confirmButton = page.getByTestId("confirm-button"),
    readonly checkbox = page.getByTestId("checkbox").getByRole("checkbox"),
    readonly productCheckbox = page.getByTestId("product").getByTestId("checkbox"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    readonly searchInput = page.getByTestId("search-query").locator("input"),
  ) {
    super(page)
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }
  async clickBackButton() {
    await this.confirmButton.click();
  }

  async searchForProductInDialog(productName: string) {
    await this.searchInput.fill(productName);
  }

async selectVariantBySKU(sku: string) {
const variant = this.variantRow.filter({hasText:`SKU ${sku}`})
await variant.waitFor({state:"visible"});
await variant.getByRole("checkbox").click();
}
}
