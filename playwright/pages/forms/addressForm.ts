import { AddressFieldsType } from "@data/addresses";
import { BasePage } from "@pages/basePage";
import { Page } from "@playwright/test";

export class AddressForm extends BasePage {
  constructor(
    page: Page,
    readonly firstNameInput = page.getByTestId("first-name-input").locator("input"),
    readonly lastNameInput = page.getByTestId("last-name-input").locator("input"),
    readonly companyNameInput = page.getByTestId("company-name-input").locator("input"),
    readonly phoneInput = page.getByTestId("phone-input").locator("input"),
    readonly cityInput = page.getByTestId("city-input").locator("input"),
    readonly zipInput = page.getByTestId("zip-input").locator("input"),
    readonly addressLine1Input = page.getByTestId("address-line-1-input").locator("input"),
    readonly addressLine2Input = page.getByTestId("address-line-2-input").locator("input"),
    readonly countrySelect = page.getByTestId("address-edit-country-select-field").locator("input"),
    readonly countryAreaSelect = page
      .getByTestId("address-edit-country-area-field")
      .locator("input"),
    readonly selectOptions = page.getByTestId("select-option"),
  ) {
    super(page);
  }

  async typeFirstName(name: string) {
    await this.firstNameInput.fill(name);
  }

  async typeLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async typeCompanyName(companyName: string) {
    await this.companyNameInput.fill(companyName);
  }

  async typePhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  async typeAddressLine1(addressLine1: string) {
    await this.addressLine1Input.fill(addressLine1);
  }

  async typeAddressLine2(addressLine2: string) {
    await this.addressLine2Input.fill(addressLine2);
  }

  async typeCity(cityName: string) {
    await this.cityInput.fill(cityName);
  }

  async typeZip(zip: string) {
    await this.zipInput.fill(zip);
  }

  async selectCountryArea(countryArea: string) {
    await this.countryAreaSelect.fill(countryArea);
    await this.selectOptions.filter({ hasText: countryArea }).first().click();
  }

  async clickSubmitButton() {
    this.page.getByTestId("submit").click();
  }

  async selectCountry(country: string) {
    await this.countrySelect.click();
    await this.countrySelect.clear();
    await this.countrySelect.fill(country);
    await this.selectOptions.filter({ hasText: country }).first().click();
  }

  async completeBasicInfoAddressForm(address: AddressFieldsType) {
    await this.typeFirstName(address.firstName);
    await this.typeLastName(address.lastName);
    await this.typeAddressLine1(address.addressLine1);
    await this.typeCity(address.city);
    await this.typeZip(address.zip);
    await this.selectCountry(address.country);
    await this.waitForDOMToFullyLoad();
  }
}
