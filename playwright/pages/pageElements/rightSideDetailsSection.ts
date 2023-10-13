import type { Locator, Page } from "@playwright/test";

export class RightSideDetailsPage {
  readonly page: Page;
  readonly manageChannelsButton: Locator;
  readonly assignedChannels: Locator;
  readonly publishedRadioButtons: Locator;
  readonly availableForPurchaseRadioButtons: Locator;
  readonly radioButtonsValueTrue: Locator;
  readonly radioButtonsValueFalse: Locator;
  readonly visibleInListingsButton: Locator;
  readonly availableChannel: Locator;
  readonly categoryInput: Locator;
  readonly taxInput: Locator;
  readonly categoryItem: Locator;
  readonly collectionInput: Locator;
  readonly autocompleteDropdown: Locator;
  readonly categorySelectOption: Locator;
  readonly taxSelectOption: Locator;
  readonly collectionSelectOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categorySelectOption = page.locator("[data-test-id*='select-option']");
    this.taxSelectOption = page.locator("[data-test-id*='select-option']");
    this.collectionSelectOption = page.getByTestId(
      "multi-autocomplete-select-option",
    );
    this.categoryInput = page.getByTestId("category");
    this.taxInput = page.getByTestId("taxes");
    this.categoryItem = page.getByTestId("single-autocomplete-select-option");
    this.collectionInput = page.getByTestId("collections");
    this.autocompleteDropdown = page.getByTestId("autocomplete-dropdown");

    this.manageChannelsButton = page.getByTestId(
      "channels-availability-manage-button",
    );
    this.assignedChannels = page.getByTestId("channel-availability-item");
    this.publishedRadioButtons = page.locator("[name*='isPublished'] > ");
    this.availableForPurchaseRadioButtons = page.locator(
      "[id*='isAvailableForPurchase']",
    );
    this.radioButtonsValueTrue = page.locator("[value='true']");
    this.radioButtonsValueFalse = page.locator("[value='false']");
    this.visibleInListingsButton = page.locator("[id*='visibleInListings']");
    this.availableChannel = page.locator(
      "[data-test-id*='channel-availability-item']",
    );
  }

  async openChannelsDialog() {
    await this.manageChannelsButton.click();
  }

  async selectFirstCategory() {
    await this.categoryInput.click();
    await this.categorySelectOption.first().click();
  }
  async selectFirstTax() {
    await this.taxInput.click();
    await this.taxSelectOption.first().click();
  }
  async selectFirstCollection() {
    await this.collectionInput.click();
    await this.collectionSelectOption.first().click();
  }
}
