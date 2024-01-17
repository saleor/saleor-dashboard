import { Page } from "@playwright/test";

export class AddCountriesDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly searchCountryInput = page
      .getByTestId("search-country-input")
      .locator("input"),
    readonly countryRow = page.getByTestId("country-row"),
    readonly addButton = page.getByTestId("add-button"),
    readonly rowRadioButton = page.locator("input[type='radio']"),
  ) {
    this.page = page;
  }

  async typeSearchedCountry(countryName = "Canada") {
    await this.searchCountryInput.fill(countryName);
  }

  async checkAndSaveSingleCountry(countryName = "Canada") {
    await this.countryRow
      .filter({ hasText: countryName })
      .locator(this.rowRadioButton)
      .click();
    await this.addButton.click();
    await this.countryRow.first().waitFor({ state: "hidden" });
  }
}
