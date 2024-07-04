import { URL_LIST } from "@data/url";
import { DeleteShippingMethodDialog } from "@dialogs/deleteShippingMethodDialog";
import { BasePage } from "@pages/basePage";
import { AssignCountriesDialog } from "@pages/dialogs/assignCountriesDialog";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Page } from "@playwright/test";

export class ShippingMethodsPage extends BasePage {
  rightSideDetailsPage: RightSideDetailsPage;

  assignCountriesDialog: AssignCountriesDialog;

  deleteShippingMethodDialog: DeleteShippingMethodDialog;

  constructor(
    page: Page,
    readonly assignCountryButton = page.getByTestId("assign-country"),
    readonly addPriceRateButton = page.getByTestId("add-price-rate"),
    readonly addWeightRateButton = page.getByTestId("add-weight-rate"),
    readonly createShippingZoneButton = page.getByTestId("add-shipping-zone"),
    readonly shippingZoneNameInput = page.getByTestId("shipping-zone-name"),
    readonly shippingZoneDescriptionField = page
      .getByTestId("shipping-zone-description")
      .locator("textarea"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly shippingZoneName = page.getByTestId("page-header"),
    readonly deleteShippingRateButton = page.getByTestId("button-bar-delete"),
    readonly shippingRateNameInput = page.getByTestId("shipping-rate-name-input"),
    readonly deleteShippingRateButtonOnList = page
      .getByTestId("shipping-method-row")
      .getByRole("button")
      .getByTestId("delete-button"),
    readonly priceBasedRatesSection = page.getByTestId("price-based-rates"),
    readonly weightBasedRatesSection = page.getByTestId("weight-based-rates"),
  ) {
    super(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.assignCountriesDialog = new AssignCountriesDialog(page);
    this.deleteShippingMethodDialog = new DeleteShippingMethodDialog(page);
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
    await this.shippingZoneNameInput.fill(`${shippingZoneName} - ${new Date().toISOString()}`);
  }

  async typeShippingZoneDescription(shippingDescription = "Biggest zone in e2e world") {
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

  async gotoExistingShippingMethod(shippingMethodId: string) {
    const existingShippingMethodUrl = `${URL_LIST.shippingMethods}${shippingMethodId}`;

    await console.log(`Navigates to existing shipping method page: ${existingShippingMethodUrl}`);
    await this.page.goto(existingShippingMethodUrl);
    await this.rightSideDetailsPage.channelSection
      .locator(this.page.getByTestId("[data-test-id*='selected-option']"))
      .waitFor({
        state: "visible",
        timeout: 60000,
      });
  }

  async gotoExistingShippingRate(shippingMethodId: string, shippingRateId: string) {
    const existingShippingRateUrl = `${URL_LIST.shippingMethods}${shippingMethodId}/${shippingRateId}`;

    await console.log(`Navigates to existing shipping rate page: ${existingShippingRateUrl}`);
    await this.page.goto(existingShippingRateUrl);
    await this.shippingRateNameInput.waitFor({
      state: "visible",
      timeout: 60000,
    });
  }

  async clickCreateShippingZoneButton() {
    await this.createShippingZoneButton.click();
  }

  async clickDeletePriceBasedShippingMethod() {
    await this.priceBasedRatesSection.locator(this.deleteShippingRateButtonOnList).click();
  }

  async clickDeleteShippingRateButton() {
    await this.deleteShippingRateButton.click();
  }
}
