import type { Page } from "@playwright/test";

import { BasePage } from "./basePage";
import { ChannelSelectDialog } from "./dialogs/channelSelectDialog";
import { MetadataSeoPage } from "./pageElements/metadataSeoPage";

export class VariantsPage {
  readonly page: Page;
  channelSelectDialog: ChannelSelectDialog;
  metadataSeoPage: MetadataSeoPage;
  basePage: BasePage;

  constructor(
    page: Page,
    readonly variantNameInput = page.getByTestId("variant-name-input"),
    readonly skuTextField = page.getByTestId("sku"),
    readonly variantsList = page.getByTestId("variants-list"),
    readonly variantsNames = page.getByTestId("variant-name"),
    readonly attributeOption = page.getByTestId("select-option"),
    readonly attributeSelector = page.getByTestId("attribute-value"),
    readonly addWarehouseButton = page.getByTestId("add-warehouse"),
    readonly chooseMediaButton = page.getByTestId("choose-media-button"),
    readonly addVariantButton = page.getByTestId("button-add-variant"),
    readonly warehouseOption = page.getByRole("menuitem"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly stockInput = page.getByTestId("stock-input"),
    readonly shippingWeightInput = page.locator("[name='weight']"),
    readonly priceFieldInput = page.getByTestId("price-field"),
    readonly checkoutLimitInput = page.getByTestId("checkout-limit-input"),
    readonly assignWarehouseButton = page.getByTestId(
      "assign-warehouse-button",
    ),
    readonly booleanAttributeCheckbox = page.locator(
      "[name*='attribute'][type='checkbox']",
    ),
    readonly selectOption = page.getByTestId(
      "multi-autocomplete-select-option",
    ),
    readonly manageChannels = page.getByTestId("manage-channels-button"),
    readonly allChannels = page.locator("[name='allChannels']"),
  ) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
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
