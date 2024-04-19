import { BasePage } from "@pages/basePage";
import { AddPostalCodeDialog } from "@pages/dialogs/addPostalCodeDialog";
import { AssignProductsDialog } from "@pages/dialogs/assignProductsDialog";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Page } from "@playwright/test";

export class ShippingRatesPage {
  readonly page: Page;

  readonly basePage: BasePage;

  readonly rightSideDetailsPage: RightSideDetailsPage;

  readonly assignProductsDialog: AssignProductsDialog;

  readonly addPostalCodeDialog: AddPostalCodeDialog;

  constructor(
    page: Page,
    readonly shippingRateNameInput = page.getByTestId("shipping-rate-name-input").locator("input"),
    readonly shippingRateDescriptionField = page
      .getByTestId("rich-text-editor-description")
      .locator('[contenteditable="true"]'),
    readonly maxDeliveryTimeInput = page.getByTestId("max-delivery-time-input").locator("input"),
    readonly minDeliveryTimeInput = page.getByTestId("min-delivery-time-input").locator("input"),
    readonly addPostalCodeRangeButton = page.getByTestId("add-postal-code-range"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly assignProductButton = page.getByTestId("assign-product-button"),
    readonly assignExcludedProductsDialog = page.getByTestId("assign-products-dialog-content"),
    readonly priceInput = page.getByTestId("price-input"),
    readonly minValueInput = page.getByTestId("min-value-price-input"),
    readonly minWeightInput = page.getByTestId("min-order-weight-input").locator("input"),
    readonly maxValueInput = page.getByTestId("max-value-price-input"),
    readonly maxWeightInput = page.getByTestId("max-order-weight-input").locator("input"),
    readonly excludedProductsRows = page.getByTestId("excluded-products-rows"),
    readonly includePostalCodesRadioButton = page.getByTestId("INCLUDE"),
    readonly assignedPostalCodesRows = page.getByTestId("assigned-postal-codes-rows"),
  ) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.assignProductsDialog = new AssignProductsDialog(page);
    this.addPostalCodeDialog = new AddPostalCodeDialog(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
  }

  async addExcludedProduct(name: string) {
    await this.assignProductButton.click();
    await this.assignProductsDialog.searchForProductInDialog(name);
    await this.assignProductsDialog.selectProduct(name);
    await this.assignProductsDialog.assignAndSaveButton.click();
    await this.assignProductsDialog.assignAndSaveButton.waitFor({
      state: "hidden",
      timeout: 5000,
    });
  }

  async clickIncludePostalCodesRadioButton() {
    await this.includePostalCodesRadioButton.click();
  }

  async typeMaxAndMinValues(minValue = "2", maxValue = "378") {
    await this.minValueInput.fill(minValue);
    await this.maxValueInput.fill(maxValue);
  }

  async typeMaxAndMinWeights(minWeight = "20", maxWeight = "37800") {
    await this.minWeightInput.fill(minWeight);
    await this.maxWeightInput.fill(maxWeight);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async addPostalCodeRange() {
    await this.addPostalCodeRangeButton.click();
    await this.addPostalCodeDialog.addStartAndEndZipCodesRange();
  }

  async typeRateName(rateName = "e2e rate name") {
    await this.shippingRateNameInput.fill(rateName);
  }

  async typePrice(price = "329") {
    await this.priceInput.fill(price);
  }

  async typeRateMinDeliveryTime(minDeliveryTime = "2") {
    await this.minDeliveryTimeInput.fill(minDeliveryTime);
  }

  async typeRateMaxDeliveryTime(maxDeliveryTime = "9") {
    await this.maxDeliveryTimeInput.fill(maxDeliveryTime);
  }

  async typeRateDescription(rateDescription = "e2e description") {
    await this.shippingRateDescriptionField.fill(rateDescription);
  }
}
