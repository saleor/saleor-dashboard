import { type Page } from "@playwright/test";

export class AssignCountriesDialog {
  readonly page: Page;

  constructor(
    page: Page,
    readonly searchCountryInput = page.getByTestId("search-country-input"),
    readonly countryRow = page.getByTestId("country-row"),
    readonly restOfTheWorldRow = page.getByTestId("rest-of-the-world-row"),
    readonly assignAndSaveButton = page.getByTestId("assign-and-save-button"),
    readonly backButton = page.getByTestId("back-button"),
  ) {
    this.page = page;
  }

  async searchCountry(countryName = "Canada") {
    await this.searchCountryInput.fill(countryName);
  }

  async checkAndSaveSingleCountry(countryName = "Canada") {
    // The row renders a ControlledCheckbox, which carries no data-test-id.
    await this.countryRow.filter({ hasText: countryName }).getByRole("checkbox").click();
    await this.assignAndSaveButton.click();
    await this.countryRow.first().waitFor({ state: "hidden" });
  }
}
