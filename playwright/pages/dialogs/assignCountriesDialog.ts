import { Locator, Page } from "@playwright/test";

export class AssignCountriesDialog {
  readonly page: Page;
  readonly searchCountryInput: Locator;
  readonly countryRow: Locator;
  readonly restOfTheWorldRow: Locator;
  readonly assignAndSaveButton: Locator;
  readonly backButton: Locator;
  readonly rowCheckBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchCountryInput = page.getByTestId("search-country-input");
    this.countryRow = page.getByTestId("country-row");
    this.restOfTheWorldRow = page.getByTestId("rest-of-the-world-row");
    this.assignAndSaveButton = page.getByTestId("assign-and-save-button");
    this.backButton = page.getByTestId("back-button");
    this.rowCheckBox = page.getByTestId("checkbox");
  }

  async searchCountry(countryName = "Canada") {
    await this.searchCountryInput.fill(countryName);
  }

  async checkAndSaveSingleCountry(countryName = "Canada") {
    await this.countryRow
      .filter({ hasText: countryName })
      .locator(this.rowCheckBox)
      .click();
    await this.assignAndSaveButton.click();
    await this.countryRow.first().waitFor({ state: "hidden" });
  }
}
