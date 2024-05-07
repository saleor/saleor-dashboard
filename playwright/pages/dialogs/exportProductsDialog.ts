import { Page } from "@playwright/test";

export class ExportProductsDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly channelsAccordion = page.getByTestId("channel-expand-button"),
    readonly nextButton = page.getByTestId("next"),
    readonly submitButton = page.getByTestId("submit"),
    readonly exportSearchedProductsRadioButton = page.getByTestId("FILTER"),
    readonly exportSelectedProductsRadioButton = page.getByTestId("IDS"),
    readonly exportAllProductsRadioButton = page.getByTestId("ALL"),
  ) {
    this.page = page;
  }
  async clickChannelsAccordion() {
    await this.channelsAccordion.click();
  }
  async clickNextButton() {
    await this.nextButton.click();
  }
  async clickSubmitButton() {
    await this.submitButton.click();
  }
  async clickExportSearchedProductsRadioButton() {
    await this.exportSearchedProductsRadioButton.click();
  }

  async clickExportSelectedProductsRadioButton() {
    await this.exportSelectedProductsRadioButton.click();
  }

  async clickExportAllProductsRadioButton() {
    await this.exportAllProductsRadioButton.click();
  }

  async checkChannelCheckbox(channel = "PLN") {
    await this.page.locator(`[name="Channel-${channel}"]`).click();
  }
}
