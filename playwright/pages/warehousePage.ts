import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class WarehousePage {
  readonly page: Page;
  readonly createNewWarehouseButton: Locator;
  readonly saveButton: Locator;
  readonly warehouseNameInput: Locator;
  readonly companyNameInput: Locator;
  readonly companyCityInput: Locator;
  readonly companyAddressLine1Input: Locator;
  readonly companyAddressLine2Input: Locator;
  readonly companyZipInput: Locator;
  readonly companyPhoneInput: Locator;
  readonly companyCountrySelect: Locator;
  readonly companyCountryOptions: Locator;
  readonly basePage: BasePage;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.createNewWarehouseButton = page.getByTestId("create-warehouse");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.warehouseNameInput = page
      .getByTestId("warehouse-name-input")
      .locator("input");
    this.companyNameInput = page
      .getByTestId("company-name-input")
      .locator("input");
    this.companyAddressLine1Input = page
      .getByTestId("company-address-line-1-input")
      .locator("input");
    this.companyAddressLine2Input = page
      .getByTestId("company-address-line-2-input")
      .locator("input");
    this.companyCityInput = page
      .getByTestId("company-city-input")
      .locator("input");
    this.companyZipInput = page
      .getByTestId("company-zip-input")
      .locator("input");
    this.companyPhoneInput = page
      .getByTestId("company-phone-input")
      .locator("input");
    this.companyCountrySelect = page.getByTestId(
      "address-edit-country-select-field",
    );
    this.companyCountryOptions = page.getByTestId(
      "single-autocomplete-select-option",
    );
  }

  async clickCreateNewWarehouseButton() {
    await this.createNewWarehouseButton.click();
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }

  async completeWarehouseForm(
    warehouseName = "e2e test - warehouse XXL",
    companyName = "e2e test - Looney Acme",
    lineAddress1 = "e2e test - wild road",
    lineAddress2 = "e2e test - 999/0",
    cityName = "e2e test - Looney vile",
    zip = "C1417",
    phone = "++541159133745",
    country = "Argentina",
  ) {
    await this.warehouseNameInput.fill(warehouseName);
    await this.companyNameInput.fill(companyName);
    await this.companyAddressLine1Input.fill(lineAddress1);
    await this.companyAddressLine2Input.fill(lineAddress2);
    await this.companyCityInput.fill(cityName);
    await this.companyZipInput.fill(zip);
    await this.companyPhoneInput.fill(phone);
    await this.companyCountrySelect.click();
    await this.page
      .getByTestId("autocomplete-dropdown")
      .getByRole("option", { name: country })
      .click();
  }
}
