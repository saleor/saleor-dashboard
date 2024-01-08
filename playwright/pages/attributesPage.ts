import { BasePage } from "@pages/basePage";
import { AddValueDialog } from "@pages/dialogs/addValueDialog";
import type { Page } from "@playwright/test";

export class AttributesPage {
  readonly page: Page;
  readonly addValueDialog: AddValueDialog;
  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly createAttributeButton = page.getByTestId(
      "create-attribute-button",
    ),
    readonly valueRequiredCheckbox = page.getByLabel("Value Required"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly attributesRows = page.getByTestId("attributes-rows"),
    readonly assignAttributeValueButton = page.getByTestId(
      "assign-value-button",
    ),
    readonly attributeSelect = page.getByTestId("attribute-type-select"),
    readonly attributeDefaultLabelInput = page
      .getByTestId("attribute-default-label-input")
      .locator("input"),
    readonly attributeCodeInput = page
      .getByTestId("attribute-code-input")
      .locator("input"),
  ) {
    this.page = page;
    this.addValueDialog = new AddValueDialog(page);
    this.basePage = new BasePage(page);
  }

  async clickCreateAttributeButton() {
    await this.createAttributeButton.click();
  }
  async clickValueRequiredCheckbox() {
    await this.valueRequiredCheckbox.click();
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }
  async selectAttributeType(attributeType = "DROPDOWN") {
    await this.attributeSelect.click();
    await this.page.getByTestId(`select-field-option-${attributeType}`).click();
  }
  async clickAssignAttributeValueButton() {
    await this.assignAttributeValueButton.click();
  }

  async typeAttributeDefaultLabel(attributeDefaultLabel: string) {
    await this.attributeDefaultLabelInput.fill(attributeDefaultLabel);
  }
}
