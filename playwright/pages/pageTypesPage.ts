import type { Page } from "@playwright/test";
import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@pages/dialogs/deleteDialog";
import { AssignAttributeDialog } from "@pages/dialogs/assignAttributeDialog";

export class PageTypesPage extends BasePage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly deletePageTypeDialog: DeleteDialog;
  readonly attributeDialog: AssignAttributeDialog;

  constructor(
    page: Page,
    readonly createPageTypeButton = page.getByTestId("create-page-type"),
    readonly nameInput = page.getByTestId("page-type-name").locator("input"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-page-types"),
    readonly pageTypeList = page.getByTestId("page-types-list"),
    readonly rowCheckbox = page.getByTestId("checkbox"),
    readonly assignAttributesButton = page.getByTestId("assign-attributes"),
    readonly pageAttributes = page.getByTestId("page-attributes"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
    this.deletePageTypeDialog = new DeleteDialog(page);
    this.attributeDialog = new AssignAttributeDialog(page);
  }
  async assignAttributes(attributeName: string) {
    await this.assignAttributesButton.click();
    await this.attributeDialog.assignSpecificAttributeByNameAndSave(attributeName)
  }

  async gotoPageTypeListPage() {
    await this.page.goto(URL_LIST.pageTypes);
  }

  async clickCreatePageTypeButton() {
    await this.createPageTypeButton.click();
  }

  async typePageTypeName(name: string) {
    await this.nameInput.fill(name);
  }

  async updatePageTypeName(name: string) {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async gotoExistingPageTypePage(pageTypeId: string) {
    const existingPageTypeUrl = URL_LIST.pageTypes + pageTypeId;
    await console.log(
      "Navigating to page type details: " + existingPageTypeUrl,
    );
    await this.page.goto(existingPageTypeUrl);
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async checkPageTypesOnList(listRows: string[]) {
    for (const row of listRows) {
      const rowLocator = this.page.getByTestId(`id-${row}`);
      await rowLocator.locator("input").click();
    }
  }
}
