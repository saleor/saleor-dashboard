import { ChannelSelectDialog } from "@pages/dialogs/channelSelectDialog";
import { expect, Page } from "@playwright/test";

export class RightSideDetailsPage {
  readonly channelSelectDialog: ChannelSelectDialog;
  readonly page: Page;

  constructor(
    page: Page,
    readonly selectWarehouseShippingMethodButton = page.getByTestId(
      "select-warehouse-for-shipping-method",
    ),
    readonly selectChannelShippingPageButton = page.getByTestId(
      "select-channel-for-shipping-method",
    ),

    readonly categorySelectOption = page.locator(
      "[data-test-id*='select-option']",
    ),
    readonly taxSelectOption = page.locator("[data-test-id*='select-option']"),
    readonly selectOption = page.getByTestId(
      "multi-autocomplete-select-option",
    ),
    readonly categoryInput = page.getByTestId("category"),
    readonly taxInput = page.getByTestId("taxes"),
    readonly categoryItem = page.getByTestId(
      "single-autocomplete-select-option",
    ),
    readonly collectionInput = page.getByTestId("collections"),
    readonly autocompleteDropdown = page.getByTestId("autocomplete-dropdown"),

    readonly manageChannelsButton = page.getByTestId(
      "channels-availability-manage-button",
    ),
    readonly assignedChannels = page.getByTestId("channel-availability-item"),
    readonly publishedRadioButtons = page.locator("[name*='isPublished'] > "),
    readonly availableForPurchaseRadioButtons = page.locator(
      "[id*='isAvailableForPurchase']",
    ),
    readonly radioButtonsValueTrue = page.locator("[value='true']"),
    readonly radioButtonsValueFalse = page.locator("[value='false']"),
    readonly visibleInListingsButton = page.locator(
      "[id*='visibleInListings']",
    ),
    readonly availableChannel = page.locator(
      "[data-test-id*='channel-availability-item']",
    ),
    readonly editShippingAddressButton = page.getByTestId(
      "edit-shipping-address",
    ),
    readonly editBillingAddressButton = page.getByTestId(
      "edit-billing-address",
    ),
    readonly shippingAddressSection = page.getByTestId(
      "shipping-address-section",
    ),
    readonly billingAddressSection = page.getByTestId(
      "billing-address-section",
    ),
    readonly editCustomerButton = page.getByTestId("edit-customer"),
    readonly searchCustomerInput = page.getByTestId("select-customer"),
    readonly selectCustomerOption = page.getByTestId(
      "single-autocomplete-select-option",
    ),
  ) {
    this.page = page;
    this.channelSelectDialog = new ChannelSelectDialog(page);
  }

  async clickEditBillingAddressButton() {
    await this.editBillingAddressButton.click();
  }
  async clickEditShippingAddressButton() {
    await this.editShippingAddressButton.click();
  }

  async clickWarehouseSelectShippingPage() {
    await this.selectWarehouseShippingMethodButton.click();
  }

  async typeAndSelectSingleWarehouseShippingPage(warehouse = "Europe") {
    await this.selectWarehouseShippingMethodButton
      .locator("input")
      .fill(warehouse);

    await this.selectOption.filter({ hasText: warehouse }).first().click();
    // below click hides prompted options
    this.clickWarehouseSelectShippingPage();
  }

  async clickChannelsSelectShippingPage() {
    await this.selectChannelShippingPageButton.click();
  }
  async selectSingleChannelShippingPage(channel = "PLN") {
    await this.selectOption.filter({ hasText: `Channel-${channel}` }).click();
    // below click hides prompted options
    this.clickChannelsSelectShippingPage();
  }

  async openChannelsDialog() {
    await this.manageChannelsButton.click();
  }

  async selectFirstCategory() {
    await this.categoryInput.click();
    await this.categorySelectOption.first().click();
  }
  async selectFirstTax() {
    await expect(this.taxInput.locator("input")).not.toBeDisabled();
    await this.taxInput.click();
    await this.taxSelectOption.first().click();
  }
  async selectTaxIndex(taxIndexOnList: number) {
    await this.taxInput.click();
    await this.taxSelectOption.nth(taxIndexOnList).click();
  }
  async selectFirstCollection() {
    await this.collectionInput.click();
    await this.selectOption.first().click();
  }

  async clickEditCustomerButton() {
    await this.editCustomerButton.click();
  }

  async clickSearchCustomerInput() {
    await this.searchCustomerInput.click();
  }

  async selectCustomer(customer = "allison.freeman@example.com") {
    await this.selectCustomerOption.locator(`text=${customer}`).click();
  }

  async selectOneChannelAsAvailableWhenMoreSelected() {
    await this.manageChannelsButton.click();
    await this.channelSelectDialog.clickAllChannelsCheckbox();
    await this.channelSelectDialog.selectFirstChannel();
    await this.channelSelectDialog.clickConfirmButton();
  }
  async selectOneChannelAsAvailableWhenNoneSelected() {
    await this.manageChannelsButton.click();
    await this.channelSelectDialog.selectFirstChannel();
    await this.channelSelectDialog.clickConfirmButton();
    await this.page.waitForLoadState("domcontentloaded");
  }
}
