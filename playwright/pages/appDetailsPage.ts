import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

import { DeleteDialog } from "./dialogs/deleteDialog";

export class AppDetailsPage extends BasePage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly deleteAppDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly appDetailsSection = page.getByTestId("app-details-section"),
    readonly appDeleteButton = page.getByTestId("app-delete-button"),
    readonly appActivateButton = page.getByTestId("app-activate-button"),
    readonly appEditPermissionsButton = page.getByTestId(
      "app-edit-permissions-button",
    ),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
    this.deleteAppDialog = new DeleteDialog(page);
  }

  async clickAppDeleteButton() {
    await this.appDeleteButton.click();
  }

  async clickAppActivateButton() {
    await this.appActivateButton.click();
  }
}
