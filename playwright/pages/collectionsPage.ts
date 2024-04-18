import { URL_LIST } from "@data/url";
import { AssignSpecificProductsDialog } from "@dialogs/assignSpecificProductsDialog";
import { MetadataSeoPage } from "@pageElements/metadataSeoPage";
import { RightSideDetailsPage } from "@pageElements/rightSideDetailsSection";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";
import path from "path";

import { DeleteDialog } from "./dialogs/deleteDialog";

export class CollectionsPage extends BasePage {
  readonly page: Page;
  readonly metadataSeoPage: MetadataSeoPage;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly assignSpecificProductsDialog: AssignSpecificProductsDialog;
  readonly deleteCollectionDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly createCollectionButton = page.getByTestId("create-collection"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly assignedSpecificProductRow = page.getByTestId(
      "assign-product-table-row",
    ),
    readonly assignProductButton = page.getByTestId("add-product"),
    readonly collectionImages = page.getByTestId("product-image"),
    readonly uploadImageButton = page.getByTestId("upload-image-button"),
    readonly collectionNameInput = page
      .getByTestId("collection-name-input")
      .locator("input"),
    readonly collectionDescriptionEditor = page.getByTestId(
      "rich-text-editor-description",
    ),
    readonly descriptionLoader = page.locator(".codex-editor__loader"),
  ) {
    super(page);
    this.page = page;
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
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

  async clickUploadImageButton() {
    await this.uploadImageButton.click();
  }

  async gotoCollectionsListView() {
    await this.page.goto(URL_LIST.collections);
  }

  async gotoExistingCollectionView(collectionId: string) {
    const collectionUrl = URL_LIST.collections + collectionId;
    await console.log(
      "Navigating to existing collection url: " + collectionUrl,
    );
    await this.page.goto(collectionUrl);
  }

  async typeCollectionName(collectionName: string) {
    await this.collectionNameInput.fill(collectionName);
  }

  async typeCollectionDescription(collectionDescription: string) {
    await this.descriptionLoader.waitFor({ state: "hidden" });
    await this.collectionDescriptionEditor
      .locator('[contenteditable="true"]')
      .fill(collectionDescription);
  }

  async uploadCollectionImage(fileName: string) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.clickUploadImageButton();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join("playwright/data/images/", fileName));
    await this.page.waitForLoadState("domcontentloaded");
  }
}
