import type { Page } from "@playwright/test";

export class FulfillmentPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly fulfillButton = page.getByTestId("button-bar-confirm"),
    readonly warehouseSelect = page.getByTestId("select-warehouse-button"),
    readonly warehouseDialogConfirmButton = page.getByRole("button", { name: "Select" }),
  ) {
    this.page = page;
  }

  async clickFulfillButton() {
    await this.fulfillButton.click();
  }

  async selectWarehouseFromList(warehouseName: string): Promise<void> {
    await this.warehouseSelect.first().click();
    await this.page.getByLabel(warehouseName, { exact: false }).first().click();
    await this.warehouseDialogConfirmButton.click();
  }
}
