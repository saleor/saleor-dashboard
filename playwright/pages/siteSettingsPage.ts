import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";
import { inputByTestId } from "utils/locators";

export class SiteSettingsPage extends BasePage {
  constructor(
    page: Page,
    readonly companyInput = inputByTestId(page, "company-name-input"),
    readonly addressLine1Input = inputByTestId(page, "company-address-line-1-input"),
    readonly addressLine2Input = inputByTestId(page, "company-address-line-2-input"),
    readonly city = inputByTestId(page, "company-city-input"),
    readonly countryInput = page.getByTestId("address-edit-country-select-field"),
    readonly autocompleteDropdownCountry = page.locator(
      '[data-portal-for="autocomplete-dropdown-country"]',
    ),
    readonly autocompleteDropdownCountryArea = page.locator(
      '[data-portal-for="autocomplete-dropdown-country-area"]',
    ),
    readonly countryAreaDropdown = page.getByTestId("address-edit-country-area-field"),
    readonly zipInput = inputByTestId(page, "company-zip-input"),
    readonly phoneInput = inputByTestId(page, "company-phone-input"),
    readonly emailConfirmationCheckbox = page.getByTestId("require-email-confirmation-checkbox"),
    readonly companyInfoSection = page.getByTestId("company-info"),
  ) {
    super(page);
  }

  async gotoSiteSettings() {
    await this.page.goto(URL_LIST.siteSettings);
  }

  async completeAddressForm(
    companyName: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    country: string,
    countryArea: string,
    zip: string,
    phone: string,
  ) {
    await this.companyInput.fill(companyName);
    await this.addressLine1Input.fill(addressLine1);
    await this.addressLine2Input.fill(addressLine2);
    await this.city.fill(city);
    await this.countryInput.click();
    await this.autocompleteDropdownCountry.getByText(country, { exact: true }).click();
    await this.autocompleteDropdownCountry.blur();
    await this.countryAreaDropdown.fill(countryArea);
    await this.autocompleteDropdownCountryArea.getByText(countryArea, { exact: true }).click();
    await this.autocompleteDropdownCountryArea.blur();
    await this.zipInput.fill(zip);
    await this.phoneInput.fill(phone);
  }
}
