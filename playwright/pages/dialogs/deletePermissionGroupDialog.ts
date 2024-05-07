import type { Page } from "@playwright/test";

export class DeletePermissionGroupDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly deleteButton = page.getByTestId("submit"),
    readonly deleteDialog = page.getByRole("dialog").getByText("Delete Permission Group"),
    readonly deleteDialogContent = page.getByTestId("permission-group-delete-dialog-text"),
  ) {
    this.page = page;
  }

  async clickConfirmDeleteButton() {
    await this.deleteButton.click();
  }
}
