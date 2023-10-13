import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";
import { ChannelSelectDialog } from "./dialogs/channelSelectDialog";
import { MetadataSeoPage } from "./pageElements/metadataSeoPage";

export class VariantsPage {
  readonly page: Page;
  readonly variantNameInput: Locator;
  readonly skuTextField: Locator;
  readonly attributeOption: Locator;
  readonly attributeSelector: Locator;
  readonly addWarehouseButton: Locator;
  readonly warehouseOption: Locator;
  readonly saveButton: Locator;
  readonly stockInput: Locator;
  readonly booleanAttributeCheckbox: Locator;
  readonly selectOption: Locator;
  readonly manageChannels: Locator;
  readonly allChannels: Locator;
  readonly chooseMediaButton: Locator;
  readonly assignWarehouseButton: Locator;
  readonly addVariantButton: Locator;
  readonly priceFieldInput: Locator;
  readonly variantsList: Locator;
  readonly variantsNames: Locator;
  readonly checkoutLimitInput: Locator;
  readonly shippingWeightInput: Locator;
  channelSelectDialog: ChannelSelectDialog;
  metadataSeoPage: MetadataSeoPage;
  basePage: BasePage;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
    this.variantNameInput = page.getByTestId("variant-name-input");
    this.skuTextField = page.getByTestId("sku");
    this.variantsList = page.getByTestId("variants-list");
    this.variantsNames = page.getByTestId("variant-name");
    this.attributeOption = page.getByTestId("select-option");
    this.attributeSelector = page.getByTestId("attribute-value");
    this.addWarehouseButton = page.getByTestId("add-warehouse");
    this.chooseMediaButton = page.getByTestId("choose-media-button");
    this.addVariantButton = page.getByTestId("button-add-variant");
    this.warehouseOption = page.getByRole("menuitem");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.stockInput = page.getByTestId("stock-input");
    this.shippingWeightInput = page.locator("[name='weight']");
    this.priceFieldInput = page.getByTestId("price-field");
    this.checkoutLimitInput = page.getByTestId("checkout-limit-input");
    this.assignWarehouseButton = page.getByTestId("assign-warehouse-button");
    this.booleanAttributeCheckbox = page.locator(
      "[name*='attribute'][type='checkbox']",
    );
    this.selectOption = page.getByTestId("multi-autocomplete-select-option");
    this.manageChannels = page.getByTestId("manage-channels-button");
    this.allChannels = page.locator("[name='allChannels']");
  }

  async typeVariantName(variantName = "XXL beverage") {
    await this.variantNameInput.fill(variantName);
  }
  async typeShippingWeight(weight = "150") {
    await this.shippingWeightInput.fill(weight);
  }
  async typeCheckoutLimit(checkoutLimit = "10") {
    await this.checkoutLimitInput.fill(checkoutLimit);
  }
  async typeSellingPriceInChannel(
    channelName: string,
    sellingPriceValue = "99",
  ) {
    await this.page
      .locator(`[data-test-id="Channel-${channelName}"]`)
      .locator(this.priceFieldInput)
      .first()
      .fill(sellingPriceValue);
  }
  async typeCostPriceInChannel(channelName: string, costPriceValue = "10") {
    await this.page
      .locator(`[data-test-id="Channel-${channelName}"]`)
      .locator(this.priceFieldInput)
      .last()
      .fill(costPriceValue);
  }

  async clickMageChannelsButton() {
    await this.manageChannels.click();
  }
  async clickChooseMediaButton() {
    await this.chooseMediaButton.click();
  }
  async clickAddVariantButton() {
    await this.addVariantButton.click();
  }

  async typeSku(sku = "sku dummy e2e") {
    await this.skuTextField.fill(sku);
  }
  async clickAssignWarehouseButton() {
    await this.assignWarehouseButton.click();
  }
  async clickSaveVariantButton() {
    await this.saveButton.click();
  }
  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }
  async selectFirstAttributeValue() {
    await this.attributeSelector.click();
    await this.attributeOption.first().click();
  }
  async selectWarehouse(warehouse = "Oceania") {
    await this.clickAssignWarehouseButton();
    await this.warehouseOption.locator(`text=${warehouse}`).click();
  }
  async typeQuantityInStock(warehouse = "Oceania", quantity = "10") {
    const quantityInput = await this.page
      .getByTestId(warehouse)
      .locator(this.stockInput);
    await quantityInput.clear();
    await quantityInput.fill(quantity);
  }
  async addAllMetaData() {
    await this.metadataSeoPage.expandAndAddAllMetadata();
  }
}
