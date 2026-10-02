import { URL_LIST } from "@data/url";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class CategoriesPage extends BasePage {
  readonly page: Page;

  readonly deleteCategoriesDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly createCategoryButton = page.getByTestId("create-category"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly createCategorySubmitButton = page
      .getByTestId("create-category-dialog")
      .getByTestId("submit"),
    readonly categoryProductsCard = page.getByTestId("category-products"),
    readonly categoryDescriptionEditor = page.getByTestId("rich-text-editor-description"),
    readonly categoryDescriptionLoader = page.locator(".codex-editor__loader"),
    readonly categoryNameInput = page.getByTestId("category-name-input").locator("input"),
    readonly createCategoryDescriptionInput = page
      .getByTestId("category-description-input")
      .locator("textarea"),
  ) {
    super(page);
    this.page = page;
    this.deleteCategoriesDialog = new DeleteDialog(page);
  }

  async gotoCategoryListView() {
    await this.page.goto(URL_LIST.categories);
  }

  async gotoExistingCategoriesPage(categoryId: string) {
    const categoryUrl = URL_LIST.categories + categoryId;

    await console.log("Navigating to category details: " + categoryUrl);
    await this.page.goto(categoryUrl);
  }

  async clickCreateNewCategoryButton() {
    await this.createCategoryButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickCreateCategorySubmitButton() {
    await this.createCategorySubmitButton.click();
  }

  async typeCategoryName(categoryName: string) {
    await this.categoryNameInput.fill(categoryName);
  }

  async typeCreateCategoryDescription(categoryDescription: string) {
    await this.createCategoryDescriptionInput.fill(categoryDescription);
  }

  async typeCategoryDescription(categoryDescription: string) {
    await this.categoryDescriptionLoader.waitFor({ state: "hidden" });
    await this.categoryDescriptionEditor
      .locator('[contenteditable="true"]')
      .fill(categoryDescription);
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }
}
