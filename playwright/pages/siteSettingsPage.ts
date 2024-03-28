import type { Page } from "@playwright/test";
import { BasePage } from "@pages/basePage";
import { URL_LIST } from "@data/url";

export class SiteSettingsPage extends BasePage {
  constructor(
    page: Page,
    readonly companyInfoSection = page.locator('[data-test-id="company-info"]'),
    readonly stockReservationForAuthUserInput = page.locator(
      "[name='reserveStockDurationAuthenticatedUser']",
    ),
    readonly stockReservationForAnonymousUserInput = page.locator(
      "[name='reserveStockDurationAnonymousUser']",
    ),
    readonly checkoutLineLimitInput = page.locator(
      "[name='limitQuantityPerCheckout']",
    ),
    readonly companyInput = page.locator("[name='companyName']"),
    readonly addressLine1Input = page.locator("[name=streetAddress1']"),
    readonly addressLine2Input = page.locator("[name=streetAddress2']"),
    readonly city = page.locator("[name=city']"),
    readonly countryInput = page
      .getByTestId("downshift-0-input")
      .locator("text"),
    readonly countryAreaDropdown = page.getByTestId(
      "address-edit-country-area-field",
    ),
    readonly zipInput = page.locator("[name=postalCode']"),
    readonly phoneInput = page.locator("[name=phone']"),
    readonly saveButton = page
      .getByTestId("button-bar-confirm")
      .locator("button"),
    readonly backButton = page
      .getByTestId("button-bar-cancel")
      .locator("button"), ///readonly requireEmailConfirmationCheckbox = page.getByRole( ///  'checkbox, {name:''}'
  ) {
    super(page);
  }

  async gotoSiteSettings() {
    await this.page.goto(URL_LIST.siteSettings);
  }
}
