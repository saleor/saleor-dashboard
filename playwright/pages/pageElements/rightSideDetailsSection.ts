import { BasePage } from "@pages/basePage";
import { ChannelSelectDialog } from "@pages/dialogs/channelSelectDialog";
import { expect, Locator, Page } from "@playwright/test";

export class RightSideDetailsPage extends BasePage {
  readonly channelSelectDialog: ChannelSelectDialog;

  constructor(
    page: Page,
    readonly selectWarehouseShippingMethodButton = page.getByTestId(
      "select-warehouse-for-shipping-method",
    ),
    readonly stockSettingsSection = page.getByTestId("stock-settings-section"),
    readonly channelSection = page.getByTestId("channel-section"),
    readonly warehouseSection = page.getByTestId("warehouse-section"),
    readonly selectChannelShippingPageButton = page.getByTestId(
      "select-channel-for-shipping-method",
    ),
    readonly pickupDisabledButton = page.getByTestId("DISABLED"),
    readonly pickupAllWarehousesButton = page.getByTestId("ALL"),
    readonly categorySelectOption = page.locator("[data-test-id*='select-option']"),
    readonly taxSelectOption = page.locator("[data-test-id*='select-option']"),
    readonly selectOption = page.getByTestId("select-option"),
    readonly categoryInput = page.getByTestId("category"),
    readonly taxInput = page.getByTestId("taxes"),
    readonly categoryItem = page.getByTestId("single-autocomplete-select-option"),
    readonly collectionInput = page.getByTestId("collections"),
    readonly autocompleteDropdown = page.getByTestId("autocomplete-dropdown"),
    readonly manageChannelsButton = page.getByTestId("channels-availability-manage-button"),
    readonly expandButton = page.getByTestId("expand-icon"),
    readonly assignedChannels = page.getByTestId("channel-availability-item"),
    readonly publishedRadioButtons = page.locator("[name*='isPublished'] > "),
    readonly availableForPurchaseRadioButtons = page.locator("[id*='isAvailableForPurchase']"),
    readonly radioButtonsValueTrue = page.locator("[value='true']"),
    readonly radioButtonsValueFalse = page.locator("[value='false']"),
    readonly visibleInListingsButton = page.locator("[id*='visibleInListings']"),
    readonly availableChannel = page.locator("[data-test-id*='channel-availability-item']"),
    readonly editShippingAddressButton = page.getByTestId("edit-shipping-address"),
    readonly editBillingAddressButton = page.getByTestId("edit-billing-address"),
    readonly shippingAddressSection = page.getByTestId("shipping-address-section"),
    readonly billingAddressSection = page.getByTestId("billing-address-section"),
    readonly warehousesSection = page.getByTestId("warehouses-section"),
    readonly shippingZoneSection = page.getByTestId("shipping-zones-section"),
    readonly editCustomerButton = page.getByTestId("edit-customer"),
    readonly searchCustomerInput = page.getByTestId("select-customer"),
    readonly selectCustomerOption = page.getByTestId("single-autocomplete-select-option"),
    readonly addShippingZonesButton = page.getByTestId("shipping-add-link"),
    readonly addWarehousesButton = page.getByTestId("warehouse-add-link"),
    readonly shippingZonesSelect = page.getByTestId("shipping-auto-complete-select"),
    readonly warehouseSelect = page.getByTestId("warehouse-auto-complete-select"),
    readonly allocationHighStockButton = page.getByTestId("PRIORITIZE_HIGH_STOCK"),
  ) {
    super(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
  }

  async clickEditBillingAddressButton() {
    await this.editBillingAddressButton.click();
  }

  async clickAllocationHighStockButton() {
    await this.allocationHighStockButton.click();
  }

  async clickEditShippingAddressButton() {
    await this.editShippingAddressButton.click();
  }

  async clickWarehouseSelectShippingPage() {
    await this.selectWarehouseShippingMethodButton.click();
  }

  async expectOptionsSelected(section: Locator, names: string[]) {
    for (const name of names) {
      await expect(section.getByText(name)).toBeVisible({ timeout: 30000 });
    }
  }

  async typeAndSelectSingleWarehouseShippingPage(warehouse = "Europe") {
    await this.selectWarehouseShippingMethodButton.locator("input").fill(warehouse);

    await this.selectOption.filter({ hasText: warehouse }).first().click();
    // below click hides prompted options
    this.clickWarehouseSelectShippingPage();
  }

  async typeAndSelectMultipleWarehousesShippingPage(warehouses: string[]) {
    for (const warehouse of warehouses) {
      await this.selectWarehouseShippingMethodButton.locator("input").fill(warehouse);

      await this.selectOption.filter({ hasText: warehouse }).first().click();
    }
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

  async expandShippingZonesSection() {
    await this.shippingZoneSection.locator(this.expandButton).click();
  }

  async expandWarehousesSection() {
    await this.warehousesSection.locator(this.expandButton).click();
  }

  async clickSearchCustomerInput() {
    await this.searchCustomerInput.click();
  }

  async clickAddShippingZonesButton() {
    await this.addShippingZonesButton.click();
  }

  async clickAddWarehousesButton() {
    await this.addWarehousesButton.click();
  }

  async clickPublicStockButton() {
    await this.stockSettingsSection.getByText("Public").click();
  }

  async clickPickupDisabledButton() {
    await this.pickupDisabledButton.click();
  }

  async clickPickupAllWarehousesButton() {
    await this.pickupAllWarehousesButton.click();
  }

  async clickPrivateStockButton() {
    await this.stockSettingsSection.getByText("Private").click();
  }

  async selectShippingZone(zoneName = "Asia") {
    await this.shippingZonesSelect.click();
    await this.page.getByRole("option", { name: zoneName });
  }

  async selectWarehouse(warehouseName = "Asia") {
    await this.warehouseSelect.click();
    await this.page.getByRole("option", { name: warehouseName });
  }

  async selectCustomer(customer = "allison.freeman@example.com") {
    await this.selectCustomerOption.locator(`text=${customer}`).click();
    await this.waitForDOMToFullyLoad();
  }

  async selectOneChannelAsAvailableWhenMoreSelected(channel: string) {
    await this.manageChannelsButton.click();
    await this.channelSelectDialog.clickAllChannelsCheckbox();
    await this.channelSelectDialog.selectChannel(channel);
    await this.channelSelectDialog.clickConfirmButton();
  }

  async selectOneChannelAsAvailableWhenNoneSelected(channel: string) {
    await this.manageChannelsButton.click();
    await this.channelSelectDialog.selectChannel(channel);
    await this.channelSelectDialog.clickConfirmButton();
    await this.waitForDOMToFullyLoad();
  }
}
