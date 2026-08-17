import type { Page } from "@playwright/test";

import { AddressForm } from "../forms/addressForm";
import { inputByTestId } from "utils/locators";

export class AddressDialog {
  readonly addressForm: AddressForm;

  constructor(
    page: Page,
    readonly newAddressRadioButton = page.getByTestId("newAddress").locator('[value="newAddress"]'),
    readonly existingAddressRadioButton = page
      .getByTestId("customerAddress")
      .locator('[value="customerAddress"]'),

    readonly submitButton = page.getByTestId("submit"),
    readonly firstNameInput = inputByTestId(page, "first-name-input"),
    readonly lastNameInput = inputByTestId(page, "last-name-input"),
    readonly companyNameInput = inputByTestId(page, "company-name-input"),
    readonly phoneInput = inputByTestId(page, "phone-input"),
    readonly cityInput = inputByTestId(page, "city-input"),
    readonly zipInput = inputByTestId(page, "zip-input"),
    readonly addressLine1Input = inputByTestId(page, "address-line-1-input"),
    readonly addressLine2Input = inputByTestId(page, "address-line-2-input"),
    readonly countrySelect = page.getByTestId("address-edit-country-select-field"),
    readonly countryAreaSelect = page.getByTestId("address-edit-country-area-field"),
    readonly selectOptions = page.getByTestId("select-option"),
  ) {
    this.addressForm = new AddressForm(page);
  }

  async clickConfirmButton() {
    await this.submitButton.click();
  }

  async clickCountrySelect() {
    await this.countrySelect.click();
  }

  async clickNewAddressRadioButton() {
    await this.newAddressRadioButton.click();
  }

  async typeFirstName(name = "Test") {
    await this.firstNameInput.fill(name);
  }

  async typeLastName(lastName = "Automation") {
    await this.lastNameInput.fill(lastName);
  }

  async typeCompanyName(companyName = "Saleor") {
    await this.companyNameInput.fill(companyName);
  }

  async typePhone(phone = "123456789") {
    await this.phoneInput.fill(phone);
  }

  async typeAddressLine1(addressLine1 = "Teczowa") {
    await this.addressLine1Input.fill(addressLine1);
  }

  async typeAddressLine2(addressLine2 = "7") {
    await this.addressLine2Input.fill(addressLine2);
  }

  async typeCity(cityName = "Wroclaw") {
    await this.cityInput.fill(cityName);
  }

  async typeZip(zip = "53-601") {
    await this.zipInput.fill(zip);
  }

  async completeAddressFormAllFields(customerInfo: {
    firstName: string;
    lastName: string;
    companyName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    cityName: string;
    zip: string;
    country: string;
    countryArea?: string;
  }) {
    await this.typeFirstName(customerInfo.firstName);
    await this.typeLastName(customerInfo.lastName);
    await this.typeCompanyName(customerInfo.companyName);
    await this.typePhone(customerInfo.phone);
    await this.typeAddressLine1(customerInfo.addressLine1);
    await this.typeAddressLine2(customerInfo.addressLine2);
    await this.typeCity(customerInfo.cityName);
    await this.typeZip(customerInfo.zip);
    await this.clickCountrySelect();
    await this.countrySelect.locator("input").clear();
    await this.countrySelect.locator("input").fill(customerInfo.country);
    await this.selectOptions.getByText(customerInfo.country).click();
    await this.clickConfirmButton();
    await this.submitButton.waitFor({ state: "hidden" });
  }
}
