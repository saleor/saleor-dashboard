import { URL_LIST } from "@data/url";
import { AssignCountriesDialog } from "@pages/dialogs/assignCountriesDialog";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class ShippingMethodsPage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly assignCountriesDialog: AssignCountriesDialog;
  readonly createShippingZoneButton: Locator;
  readonly shippingZoneNameInput: Locator;
  readonly shippingZoneDescriptionField: Locator;
  readonly saveButton: Locator;
  readonly assignCountryButton: Locator;
  readonly addPriceRateButton: Locator;
  readonly addWeightRateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.assignCountriesDialog = new AssignCountriesDialog(page);
    this.assignCountryButton = page.getByTestId("assign-country");
    this.addPriceRateButton = page.getByTestId("add-price-rate");
    this.addWeightRateButton = page.getByTestId("add-weight-rate");
    this.createShippingZoneButton = page.getByTestId("add-shipping-zone");
    this.shippingZoneNameInput = page.getByTestId("shipping-zone-name");
    this.shippingZoneDescriptionField = page
      .getByTestId("shipping-zone-description")
      .locator("textarea");
    this.saveButton = page.getByTestId("button-bar-confirm");
  }

  async clickAddWeightRateButton() {
    await this.addWeightRateButton.click();
  }
  async clickAddPriceRateButton() {
    await this.addPriceRateButton.click();
  }

  async clickAssignCountryButton() {
    await this.assignCountryButton.click();
  }

  async typeShippingZoneName(shippingZoneName = "e2e shipping zone") {
    await this.shippingZoneNameInput.fill(
      `${shippingZoneName} - ${new Date().toISOString()}`,
    );
  }
  async typeShippingZoneDescription(
    shippingDescription = "Biggest zone in e2e world",
  ) {
    await this.shippingZoneDescriptionField.fill(shippingDescription);
  }

  async saveShippingZone() {
    await this.saveButton.click();
  }

  async gotoListView() {
    await this.page.goto(URL_LIST.shippingMethods);
    await this.createShippingZoneButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }
  async gotoShippingMethod(shippingMethodId: string) {
    await this.page.goto(`${URL_LIST.shippingMethods}${shippingMethodId}`);
    await this.shippingZoneNameInput.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async clickCreateShippingZoneButton() {
    await this.createShippingZoneButton.click();
  }
}
