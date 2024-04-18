import { Page } from "@playwright/test";

export class AssignCountriesDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly searchCountryInput = page.getByTestId("search-country-input"),
    readonly countryRow = page.getByTestId("country-row"),
    readonly restOfTheWorldRow = page.getByTestId("rest-of-the-world-row"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    readonly backButton = page.getByTestId("back-button"),
    readonly rowCheckBox = page.getByTestId("checkbox"),
  ) {
    this.page = page;
  }

  async searchCountry(countryName = "Canada") {
    await this.searchCountryInput.fill(countryName);
  }

  async checkAndSaveSingleCountry(countryName = "Canada") {
    await this.countryRow.filter({ hasText: countryName }).locator(this.rowCheckBox).click();
    await this.assignAndSaveButton.click();
    await this.countryRow.first().waitFor({ state: "hidden" });
  }
}
