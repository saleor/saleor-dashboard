import type { Page } from "@playwright/test";

export class DeleteAttributeDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId("submit"),
    readonly cancelButton = page.getByTestId("back"),
    readonly deleteAttributesDialogText = page.getByTestId(
      "delete-single-attr-dialog-text",
    ),
  ) {
    this.page = page;
  }

  async deleteAttribute() {
    await this.deleteButton.click();
  }
}
