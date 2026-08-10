import { URL_LIST } from "@data/url";
import { AssignSpecificProductsDialog } from "@dialogs/assignSpecificProductsDialog";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

import { DeleteDialog } from "./dialogs/deleteDialog";

export class CollectionsPage extends BasePage {
  readonly page: Page;

  readonly assignSpecificProductsDialog: AssignSpecificProductsDialog;

  readonly deleteCollectionDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly createCollectionButton = page.getByTestId("create-collection"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly createCollectionSubmitButton = page
      .getByTestId("create-collection-dialog")
      .getByTestId("submit"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly assignedSpecificProductRow = page.getByTestId("assign-product-table-row"),
    readonly assignProductButton = page.getByTestId("add-product"),
    readonly collectionNameInput = page.getByTestId("collection-name-input").locator("input"),
    readonly createCollectionDescriptionInput = page
      .getByTestId("collection-description-input")
      .locator("textarea"),
  ) {
    super(page);
    this.page = page;
    this.deleteCollectionDialog = new DeleteDialog(page);
    this.assignSpecificProductsDialog = new AssignSpecificProductsDialog(page);
  }

  async clickCreateCollectionButton() {
    await this.createCollectionButton.click();
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async clickAssignProductButton() {
    await this.assignProductButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickCreateCollectionSubmitButton() {
    await this.createCollectionSubmitButton.click();
  }

  async gotoCollectionsListView() {
    await this.page.goto(URL_LIST.collections);
  }

  async gotoExistingCollectionView(collectionId: string) {
    const collectionUrl = URL_LIST.collections + collectionId;

    await console.log("Navigating to existing collection url: " + collectionUrl);
    await this.page.goto(collectionUrl);
  }

  async typeCollectionName(collectionName: string) {
    await this.collectionNameInput.fill(collectionName);
  }

  async typeCreateCollectionDescription(collectionDescription: string) {
    await this.createCollectionDescriptionInput.fill(collectionDescription);
  }
}
