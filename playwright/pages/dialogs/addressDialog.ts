import type { Page } from "@playwright/test";

export class AddressDialog {
  constructor(
    page: Page,
    readonly newAddressRadioButton = page
      .getByTestId("newAddress")
      .locator('[value="newAddress"]'),
    readonly existingAddressRadioButton = page
      .getByTestId("customerAddress")
      .locator('[value="customerAddress"]'),

    readonly submitButton = page.getByTestId("submit"),
    readonly firstNameInput = page
      .getByTestId("first-name-input")
      .locator("input"),
    readonly lastNameInput = page
      .getByTestId("last-name-input")
      .locator("input"),
    readonly companyNameInput = page
      .getByTestId("company-name-input")
      .locator("input"),
    readonly phoneInput = page.getByTestId("phone-input").locator("input"),
    readonly cityInput = page.getByTestId("city-input").locator("input"),
    readonly zipInput = page.getByTestId("zip-input").locator("input"),
    readonly addressLine1Input = page
      .getByTestId("address-line-1-input")
      .locator("input"),
    readonly addressLine2Input = page
      .getByTestId("address-line-2-input")
      .locator("input"),
    readonly countrySelect = page.getByTestId(
      "address-edit-country-select-field",
    ),
    readonly countryAreaSelect = page.getByTestId(
      "address-edit-country-area-field",
    ),
    readonly selectOptions = page.getByTestId(
      "single-autocomplete-select-option",
    ),
  ) {}

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
    await this.countrySelect.locator("input").fill(customerInfo.country);
    await this.selectOptions.filter({ hasText: customerInfo.country }).click();
    await this.clickConfirmButton();
    await this.submitButton.waitFor({ state: "hidden" });
  }
}
