import { URL_LIST } from "@data/url";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

import { RightSideDetailsPage } from "./pageElements/rightSideDetailsSection";

export class WarehousePage extends BasePage {
  readonly page: Page;

  readonly basePage: BasePage;

  readonly deleteWarehouseDialog: DeleteDialog;

  readonly rightSideDetailsPage: RightSideDetailsPage;

  constructor(
    page: Page,
    readonly createNewWarehouseButton = page.getByTestId("create-warehouse"),
    readonly deleteWarehouseButton = page.getByTestId("delete-button"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly warehousesList = page.getByTestId("warehouses-list"),
    readonly warehouseNameInput = page.getByTestId("warehouse-name-input").locator("input"),
    readonly warehouseEmailInput = page.getByTestId("company-email-input").locator("input"),
    readonly companyNameInput = page.getByTestId("company-name-input").locator("input"),
    readonly companyAddressLine1Input = page
      .getByTestId("company-address-line-1-input")
      .locator("input"),
    readonly companyAddressLine2Input = page
      .getByTestId("company-address-line-2-input")
      .locator("input"),
    readonly companyCityInput = page.getByTestId("company-city-input").locator("input"),
    readonly companyZipInput = page.getByTestId("company-zip-input").locator("input"),
    readonly companyPhoneInput = page.getByTestId("company-phone-input").locator("input"),
    readonly companyCountrySelect = page.getByTestId("address-edit-country-select-field"),
    readonly companyCountryOptions = page.getByTestId("select-option"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
    this.deleteWarehouseDialog = new DeleteDialog(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
  }

  async clickCreateNewWarehouseButton() {
    await this.createNewWarehouseButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async completeWarehouseForm(
    warehouseName = "e2e test - warehouse XXL",
    warehouseEmail = "e2e@saleor.io",
    companyName = "e2e test - Looney Acme",
    lineAddress1 = "e2e test - wild road",
    lineAddress2 = "e2e test - 999/0",
    cityName = "e2e test - Looney vile",
    zip = "C1417",
    phone = "++541159133745",
    country = "Argentina",
  ) {
    await this.typeWarehouseName(warehouseName);
    await this.typeWarehouseEmail(warehouseEmail);
    await this.typeCompanyName(companyName);
    await this.typeAddressLine1(lineAddress1);
    await this.typeAddressLine2(lineAddress2);
    await this.companyCityInput.fill(cityName);
    await this.companyZipInput.fill(zip);
    await this.typePhone(phone);
    await this.companyCountrySelect.click();
    await this.page.getByTestId("select-option").filter({ hasText: country }).click();
  }

  async typeWarehouseName(warehouseName: string) {
    await this.warehouseNameInput.fill(warehouseName);
  }

  async typeWarehouseEmail(warehouseEmail: string) {
    await this.warehouseEmailInput.fill(warehouseEmail);
  }

  async typeAddressLine1(lineAddress1: string) {
    await this.companyAddressLine1Input.fill(lineAddress1);
  }

  async typeAddressLine2(lineAddress2: string) {
    await this.companyAddressLine2Input.fill(lineAddress2);
  }

  async typeCompanyName(warehouseName: string) {
    await this.companyNameInput.fill(warehouseName);
  }

  async typePhone(phone: string) {
    await this.companyPhoneInput.fill(phone);
  }

  async gotoWarehouseListView() {
    await this.page.goto(URL_LIST.warehouses);
  }

  async clickDeleteWarehouseButton(warehouseName: string) {
    await this.page
      .getByTestId(`warehouse-entry-${warehouseName}`)
      .locator(this.deleteWarehouseButton)
      .click();
  }

  async gotoExistingWarehousePage(warehouseId: string) {
    const existingWarehouseUrl = URL_LIST.warehouses + warehouseId;

    await console.log("Navigating to warehouse details: " + existingWarehouseUrl);
    await this.page.goto(existingWarehouseUrl);
  }
}
