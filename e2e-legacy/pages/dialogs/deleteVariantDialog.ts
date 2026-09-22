import type { Page } from "@playwright/test";

export class DeleteVariantDialog {
  constructor(
    page: Page,
    readonly deleteVariantButton = page.getByTestId("delete-variant-button"),
  ) {}

  async clickDeleteVariantButton() {
    await this.deleteVariantButton.click();
  }
}
