import { URL_LIST } from "@data/url";
import { ChannelSelectDialog } from "@dialogs/channelSelectDialog";
import { DeleteVariantDialog } from "@dialogs/deleteVariantDialog";
import { MetadataSeoPage } from "@pageElements/metadataSeoPage";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class VariantsPage {
  readonly page: Page;
  channelSelectDialog: ChannelSelectDialog;
  metadataSeoPage: MetadataSeoPage;
  basePage: BasePage;
  deleteVariantDialog: DeleteVariantDialog;

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
    readonly deleteVariantButton = page.getByTestId("button-bar-delete"),
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
    this.deleteVariantDialog = new DeleteVariantDialog(page);
  }

  async typeVariantName(variantName = "XXL beverage") {
    await this.variantNameInput.clear();
    await this.variantNameInput.fill(variantName);
  }
  async typeShippingWeight(weight = "150") {
    await this.shippingWeightInput.clear();
    await this.shippingWeightInput.fill(weight);
  }
  async typeCheckoutLimit(checkoutLimit = "10") {
    await this.checkoutLimitInput.clear();
    await this.checkoutLimitInput.fill(checkoutLimit);
  }
  async typeSellingPriceInChannel(
    channelName: string,
    sellingPriceValue = "99",
  ) {
    const sellingPriceInput = await this.page
      .locator(`[data-test-id="Channel-${channelName}"]`)
      .locator(this.priceFieldInput)
      .first();
    await sellingPriceInput.clear();
    await sellingPriceInput.fill(sellingPriceValue);
  }
  async typeCostPriceInChannel(channelName: string, costPriceValue = "10") {
    const costPriceInput = await this.page
      .locator(`[data-test-id="Channel-${channelName}"]`)
      .locator(this.priceFieldInput)
      .last();

    await costPriceInput.clear();
    await costPriceInput.fill(costPriceValue);
  }

  async clickMageChannelsButton() {
    await this.manageChannels.click();
  }
  async clickDeleteVariantButton() {
    await this.deleteVariantButton.click();
  }
  async clickChooseMediaButton() {
    await this.chooseMediaButton.click();
  }
  async clickAddVariantButton() {
    await this.addVariantButton.click();
  }

  async typeSku(sku = "sku dummy e2e") {
    await this.skuTextField.clear();
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
  async selectLastAttributeValue() {
    await this.attributeSelector.locator("input").clear();
    await this.attributeSelector.click();
    await this.attributeOption.last().click();
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

  async gotoExistingVariantPage(productId: string, variantId: string) {
    console.log(
      `Navigating to existing variant: ${URL_LIST.products}${productId}/${URL_LIST.variant}${variantId}`,
    );
    await this.page.goto(
      `${URL_LIST.products}${productId}/${URL_LIST.variant}${variantId}`,
    );
    await this.variantNameInput.waitFor({ state: "visible" });
  }
}
