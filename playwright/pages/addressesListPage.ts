import type { Page } from "@playwright/test";

export class AddressesListPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly lastNameField = page.getByTestId("last-name"),
    readonly phoneField = page.getByTestId("phone"),
    readonly companyNameField = page.getByTestId(
      "company-name",
    ),
    readonly addressLinesField = page.getByTestId(
      "addressLines",
    ),
    readonly postalCodeAndCityField = page.getByTestId(
      "postal-code-and-city",
    ),
    readonly countryAreaAndCountryField = page.getByTestId(
      "country-area-and-country",
    ),
  ) {
    this.page = page;
  }
}
