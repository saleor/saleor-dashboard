import { BasePage } from "@pages/basePage";
import { AddPostalCodeDialog } from "@pages/dialogs/addPostalCodeDialog";
import { AddProductsDialog } from "@pages/dialogs/addProductsDialog";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Locator, Page } from "@playwright/test";

export class ShippingRatesPage {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly addProductsDialog: AddProductsDialog;
  readonly addPostalCodeDialog: AddPostalCodeDialog;
  readonly shippingRateNameInput: Locator;
  readonly shippingRateDescriptionField: Locator;
  readonly minDeliveryTimeInput: Locator;
  readonly maxDeliveryTimeInput: Locator;
  readonly priceInput: Locator;
  readonly minValueInput: Locator;
  readonly minWeightInput: Locator;
  readonly maxValueInput: Locator;
  readonly maxWeightInput: Locator;
  readonly addPostalCodeRangeButton: Locator;
  readonly saveButton: Locator;
  readonly assignProductButton: Locator;
  readonly includePostalCodesRadioButton: Locator;
  readonly excludedProductsRows: Locator;
  readonly assignedPostalCodesRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.addProductsDialog = new AddProductsDialog(page);
    this.addPostalCodeDialog = new AddPostalCodeDialog(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.shippingRateNameInput = page
      .getByTestId("shipping-rate-name-input")
      .locator("input");
    this.shippingRateDescriptionField = page
      .getByTestId("rich-text-editor-description")
      .locator('[contenteditable="true"]');
    this.maxDeliveryTimeInput = page
      .getByTestId("max-delivery-time-input")
      .locator("input");
    this.minDeliveryTimeInput = page
      .getByTestId("min-delivery-time-input")
      .locator("input");
    this.addPostalCodeRangeButton = page.getByTestId("add-postal-code-range");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.assignProductButton = page.getByTestId("assign-product-button");
    this.priceInput = page.getByTestId("price-input");
    this.minValueInput = page.getByTestId("min-value-price-input");
    this.minWeightInput = page
      .getByTestId("min-order-weight-input")
      .locator("input");
    this.maxValueInput = page.getByTestId("max-value-price-input");
    this.maxWeightInput = page
      .getByTestId("max-order-weight-input")
      .locator("input");
    this.excludedProductsRows = page.getByTestId("excluded-products-rows");
    this.includePostalCodesRadioButton = page.getByTestId("INCLUDE");
    this.assignedPostalCodesRows = page.getByTestId(
      "assigned-postal-codes-rows",
    );
  }

  async addFirstAvailableExcludedProduct() {
    await this.assignProductButton.click();
    await this.addProductsDialog.productRowCheckbox.first().click();
    await this.addProductsDialog.assignAndSaveButton.click();
    await this.addProductsDialog.assignAndSaveButton.waitFor({
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
