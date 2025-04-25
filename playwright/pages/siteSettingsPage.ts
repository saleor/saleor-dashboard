import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class SiteSettingsPage extends BasePage {
  constructor(
    page: Page,
    readonly stockReservationForAuthUserInput = page
      .getByTestId("reserve-stock-duration-for-auth-user-input")
      .locator("input"),
    readonly stockReservationForAnonUserInput = page
      .getByTestId("reserve-stock-duration-for-anon-user-input")
      .locator("input"),
    readonly checkoutLineLimitInput = page.getByTestId("checkout-limits-input").locator("input"),
    readonly companyInput = page.getByTestId("company-name-input").locator("input"),
    readonly addressLine1Input = page.getByTestId("company-address-line-1-input").locator("input"),
    readonly addressLine2Input = page.getByTestId("company-address-line-2-input").locator("input"),
    readonly city = page.getByTestId("company-city-input").locator("input"),
    readonly countryInput = page.getByTestId("address-edit-country-select-field"),
    readonly autocompleteDropdownCountry = page.locator(
      '[data-portal-for="autocomplete-dropdown-country"]',
    ),
    readonly autocompleteDropdownCountryArea = page.locator(
      '[data-portal-for="autocomplete-dropdown-country-area"]',
    ),
    readonly countryAreaDropdown = page.getByTestId("address-edit-country-area-field"),
    readonly zipInput = page.getByTestId("company-zip-input").locator("input"),
    readonly phoneInput = page.getByTestId("company-phone-input").locator("input"),
    readonly emailConfirmationCheckbox = page.getByTestId("require-email-confirmation-checkbox"),
    readonly companyInfoSection = page.getByTestId("company-info"),
  ) {
    super(page);
  }

  async gotoSiteSettings() {
    await this.page.goto(URL_LIST.siteSettings);
  }

  async fillStockReservationForAuthUser(value: string) {
    await this.stockReservationForAuthUserInput.fill(value);
  }

  async fillStockReservationForAnonUser(value: string) {
    await this.stockReservationForAnonUserInput.fill(value);
  }

  async fillCheckoutLineLimitInput(value: string) {
    await this.checkoutLineLimitInput.fill(value);
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
