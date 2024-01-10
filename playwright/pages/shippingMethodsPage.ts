import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DeleteShippingMethodDialog } from "@dialogs/deleteShippingMethodDialog";
import { AssignCountriesDialog } from "@pages/dialogs/assignCountriesDialog";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Page } from "@playwright/test";

export class ShippingMethodsPage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly assignCountriesDialog: AssignCountriesDialog;
  readonly deleteShippingMethodDialog: DeleteShippingMethodDialog;

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
    readonly deleteShippingMethodButton = page.getByTestId("shipping-method-row").getByRole("button").getByTestId("delete-button"),
    readonly priceBasedRatesSection = page.getByTestId("price-based-rates"),
    readonly weightBasedRatesSection = page.getByTestId("weight-based-rates"),
) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.assignCountriesDialog = new AssignCountriesDialog(page);
    this.deleteShippingMethodDialog = new DeleteShippingMethodDialog(page)
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
  async gotoExistingShippingMethod(shippingMethodId: string) {
    const existingShippingMethodUrl = `${URL_LIST.shippingMethods}${shippingMethodId}`;
    await console.log(
      `Navigates to existing shipping method page: ${existingShippingMethodUrl}`,
    );
    await this.page.goto(existingShippingMethodUrl);
    await this.shippingZoneNameInput.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  async clickCreateShippingZoneButton() {
    await this.createShippingZoneButton.click();
  }

  async clickDeleteShippingMethod() {
    await this.priceBasedRatesSection.locator(this.deleteShippingMethodButton).click();

  }

}
