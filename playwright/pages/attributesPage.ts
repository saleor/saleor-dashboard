import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { AddValueDialog } from "@pages/dialogs/addValueDialog";
import { DeleteAttributeDialog } from "@pages/dialogs/deleteAttributeDialog";
import { DeleteAttributesInBulkDialog } from "@pages/dialogs/deleteAttributesInBulkDialog";
import { DeleteAttributeValueDialog } from "@pages/dialogs/deleteAttributeValueDialog";
import { EditAttributeValueDialog } from "@pages/dialogs/editAttributeValueDialog";
import type { Page } from "@playwright/test";

export class AttributesPage extends BasePage {
  readonly addValueDialog: AddValueDialog;

  readonly deleteAttributesInBulkDialog: DeleteAttributesInBulkDialog;

  readonly deleteAttributeDialog: DeleteAttributeDialog;

  readonly deleteAttributeValueDialog: DeleteAttributeValueDialog;

  readonly editAttributeValueDialog: EditAttributeValueDialog;

  constructor(
    page: Page,
    readonly createAttributeButton = page.getByTestId("create-attribute-button"),
    readonly valueRequiredCheckbox = page.getByLabel("Value Required"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly attributesRows = page.getByTestId("attributes-rows"),
    readonly assignAttributeValueButton = page.getByTestId("assign-value-button"),
    readonly attributeSelect = page.getByTestId("attribute-type-select"),
    readonly attributeDefaultLabelInput = page
      .getByTestId("attribute-default-label-input")
      .locator("input"),
    readonly attributeCodeInput = page.getByTestId("attribute-code-input").locator("input"),
    readonly bulkDeleteAttributesDialog = page.getByTestId("attribute-bulk-delete-dialog"),
    readonly deleteSingleAttributeDialog = page.getByTestId("delete-single-attr-dialog"),
    readonly dialog = page.getByRole("dialog"),
    readonly deleteAttributeValueButton = page.getByTestId("delete-attribute-value-button"),
    readonly attributeValueRows = page.getByTestId("attributes-rows"),
    readonly attributeValueName = page.getByTestId("attribute-value-name"),
    readonly deleteAttrValueDialog = page.getByTestId("delete-attribute-value-dialog"),
    readonly editAttrValueDialog = page.getByTestId("edit-attribute-value-dialog"),
    readonly attrValuesSection = page.getByTestId("attribute-values-section"),
    readonly attrEntityTypeSelect = page.locator(`[id="mui-component-select-entityType"]`),
    readonly attrVisibleInStorefrontSwitch = page.locator(`[name = "visibleInStorefront"]`),
    readonly metadataSectionAccordionButton = page
      .getByTestId("metadata-item")
      .getByTestId("expand"),
    readonly metadataAddFieldButton = page.getByTestId("metadata-item").getByTestId("add-field"),
    readonly metadataKeyInput = page.getByTestId("metadata-key-input").first(),
    readonly metadataValueInput = page.getByTestId("metadata-value-input").first(),
  ) {
    super(page);
    this.addValueDialog = new AddValueDialog(page);
    this.deleteAttributesInBulkDialog = new DeleteAttributesInBulkDialog(page);
    this.deleteAttributeDialog = new DeleteAttributeDialog(page);
    this.deleteAttributeValueDialog = new DeleteAttributeValueDialog(page);
    this.editAttributeValueDialog = new EditAttributeValueDialog(page);
  }

  async gotoListView() {
    await this.page.goto(URL_LIST.attributes);
    await this.createAttributeButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
    await this.gridCanvas.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async assertSearchResultsVisibility(searchText: string) {
    const elements = await this.page.$$("text=" + searchText);
    const otherElements = await this.page.$$("text!=" + searchText);

    for (const element of elements) {
      await element.waitForElementState("visible");
    }
    for (const element of otherElements) {
      await element.waitForElementState("hidden");
    }
  }

  async searchForAttribute(attributeName: string) {
    await this.searchInputListView.click();
  }

  async gotoExistingAttributePage(attributeId: string, attributeName: string) {
    const existingAttributeUrl = `${URL_LIST.attributes}${attributeId}`;

    await console.log(`Navigates to existing attribute page: ${existingAttributeUrl}`);
    await this.page.goto(existingAttributeUrl);
    await this.pageHeader.getByText(attributeName).waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async clickFirstCheckbox() {
    this.page.getByRole("checkbox").first().click();
  }

  async clickCreateAttributeButton() {
    await this.createAttributeButton.click();
  }

  async fillAttributeSlug(attributeSlug: string) {
    await this.attributeCodeInput.fill(attributeSlug);
  }

  async clickValueRequiredCheckbox() {
    await this.valueRequiredCheckbox.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async selectAttributeType(attributeType: string) {
    await this.page.getByTestId(attributeType).click();
  }

  async selectAttributeInputType(attributeType: string) {
    await this.attributeSelect.click();
    await this.page.getByTestId(`select-field-option-${attributeType}`).click();
  }

  async clickAssignAttributeValueButton() {
    await this.assignAttributeValueButton.click();
  }

  async clickDeleteAttrValueButton(attrName: string) {
    await this.attributeValueRows
      .filter({ hasText: attrName })
      .locator(this.deleteAttributeValueButton)
      .click();
  }

  async clickOnExistingAttrValue(attrName: string) {
    await this.attributeValueRows.filter({ hasText: attrName }).click();
    await this.editAttrValueDialog.waitFor({
      state: "visible",
      timeout: 30000,
    });
  }

  async typeAttributeDefaultLabel(attributeDefaultLabel: string) {
    await this.attributeDefaultLabelInput.fill(attributeDefaultLabel);
  }

  async selectAttributeEntityType(entityType: string) {
    await this.attrEntityTypeSelect.click();
    await this.page.getByTestId(`select-field-option-${entityType}`).click();
  }

  async changeAttributeVisibility() {
    await this.attrVisibleInStorefrontSwitch.click();
  }

  async expandMetadataSection() {
    await this.metadataSectionAccordionButton.first().click();
  }

  async addMetadataField() {
    await this.metadataAddFieldButton.click();
  }

  async fillMetadataFields(key: string, value: string) {
    await this.metadataKeyInput.fill(key);
    await this.metadataValueInput.fill(value);
  }
}
