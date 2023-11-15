import { AddValueDialog } from "@pages/dialogs/addValueDialog";
import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class AttributesPage {
  readonly page: Page;
  readonly addValueDialog: AddValueDialog;
  readonly basePage: BasePage;
  readonly createAttributeButton: Locator;
  readonly attributeSelect: Locator;
  readonly attributesRows: Locator;
  readonly attributeDefaultLabelInput: Locator;
  readonly attributeCodeInput: Locator;
  readonly assignAttributeValueButton: Locator;
  readonly saveButton: Locator;
  readonly valueRequiredCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addValueDialog = new AddValueDialog(page);
    this.basePage = new BasePage(page);
    this.createAttributeButton = page.getByTestId("create-attribute-button");
    this.valueRequiredCheckbox = page.getByLabel("Value Required");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.attributesRows = page.getByTestId("attributes-rows");
    this.assignAttributeValueButton = page.getByTestId("assign-value-button");
    this.attributeSelect = page.getByTestId("attribute-type-select");
    this.attributeDefaultLabelInput = page
      .getByTestId("attribute-default-label-input")
      .locator("input");
    this.attributeCodeInput = page
      .getByTestId("attribute-code-input")
      .locator("input");
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
