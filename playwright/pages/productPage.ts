import * as faker from "faker";

import { URL_LIST } from "@data/url";
import { ChannelSelectDialog } from "@pages/dialogs/channelSelectDialog";
import { MetadataSeoPage } from "@pages/pageElements/metadataSeoPage";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

const productName = `e2e-productName-${faker.datatype.number()}`;
const productDescription = `e2e-productDescription-${faker.datatype.number()}`;

export class ProductPage {
  readonly page: Page;

  readonly productNameInput: Locator;
  readonly productTypeInput: Locator;
  readonly categoryInput: Locator;
  readonly productsNames: Locator;
  readonly createProductButton: Locator;
  readonly searchProducts: Locator;
  readonly categoryItem: Locator;
  readonly collectionInput: Locator;
  readonly autocompleteDropdown: Locator;
  readonly firstCategoryItem: Locator;
  readonly visibleRadioBtn: Locator;
  readonly channelAvailabilityItem: Locator;
  readonly addVariantButton: Locator;
  readonly descriptionInput: Locator;
  readonly ratingInput: Locator;
  readonly variantRow: Locator;
  readonly variantPrice: Locator;
  readonly collectionRemoveButtons: Locator;
  readonly addWarehouseButton: Locator;
  readonly warehouseOption: Locator;
  readonly stockInput: Locator;
  readonly costPriceInput: Locator;
  readonly sellingPriceInput: Locator;
  readonly productImage: Locator;
  readonly uploadImageButton: Locator;
  readonly uploadSavedImagesButton: Locator;
  readonly uploadMediaUrlButton: Locator;
  readonly saveUploadUrlButton: Locator;
  readonly editVariantButton: Locator;
  readonly saveButton: Locator;
  readonly firstRowDataGrid: Locator;
  readonly addProductButton: Locator;
  readonly productUpdateFormSection: Locator;
  readonly manageChannelsButton: Locator;
  metadataSeoPage: MetadataSeoPage;
  rightSideDetailsPage: RightSideDetailsPage;
  basePage: BasePage;
  channelSelectDialog: ChannelSelectDialog;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.productsNames = page.getByTestId("name");
    this.createProductButton = page.getByTestId("add-product");
    this.searchProducts = page.locator("[placeholder='Search Products...']");
    this.productNameInput = page.locator("[name='name']");
    this.addProductButton = page.getByTestId("add-product");
    this.productTypeInput = page.getByTestId("product-type");
    this.saveButton = page.getByTestId("button-bar-confirm");
    this.categoryInput = page.getByTestId("category");
    this.categoryItem = page.getByTestId("single-autocomplete-select-option");
    this.collectionInput = page.getByTestId("collections");
    this.autocompleteDropdown = page.getByTestId("autocomplete-dropdown");
    this.descriptionInput = page
      .getByTestId("rich-text-editor-description")
      .locator("[contenteditable]");
    this.variantRow = page.getByTestId("product-variant-row");
    this.variantPrice = page.getByTestId("price");
    this.collectionRemoveButtons = page.getByTestId("collection-remove");
    this.addWarehouseButton = page.getByTestId("add-warehouse");
    this.stockInput = page.getByTestId("stock-input");
    this.productImage = page.getByTestId("product-image");
    this.uploadImageButton = page.getByTestId("button-upload-image");
    this.uploadSavedImagesButton = page.getByTestId("upload-images");
    this.uploadMediaUrlButton = page.getByTestId("upload-media-url");
    this.saveUploadUrlButton = page.getByTestId("upload-url-button");
    this.editVariantButton = page.getByTestId("row-action-button");
    this.productUpdateFormSection = page.getByTestId("product-update-form");
    this.firstCategoryItem = page.locator("#downshift-0-item-0");
    this.visibleRadioBtn = page.locator("[name='isPublished']");
    this.channelAvailabilityItem = page.locator(
      "[data-test-id*='channel-availability-item']",
    );
    this.manageChannelsButton = page.getByTestId(
      "channels-availability-manage-button",
    );
    this.addVariantButton = page.locator(
      "[data-test-id*='button-add-variant']",
    );
    this.ratingInput = page.locator("[name='rating']");
    this.warehouseOption = page.locator("[role='menuitem']");
    this.costPriceInput = page.locator("[name*='costPrice']");
    this.sellingPriceInput = page.locator("[name*='channel-price']");
    this.firstRowDataGrid = page.locator("[data-testid='glide-cell-1-0']");
  }

  async addSeo() {
    await this.metadataSeoPage.fillSeoSection();
  }
  async selectFirstCategory() {
    await this.rightSideDetailsPage.selectFirstCategory();
  }
  async selectFirstTaxOption() {
    await this.rightSideDetailsPage.selectFirstTax();
  }
  async addAllMetaData() {
    await this.metadataSeoPage.expandAndAddAllMetadata();
  }

  async typeNameDescAndRating() {
    await this.typeProductName();
    await this.typeProductRating();
    await this.typeProductDescription();
  }

  async typeProductName(name = productName) {
    await this.productNameInput.fill(name);
  }
  async typeProductDescription(description = productDescription) {
    await this.descriptionInput.type(description);
  }
  async typeProductRating(rating = "9") {
    await this.ratingInput.fill(rating);
  }
  async typeSellingPriceForChannel(
    channelName: string,
    sellingPriceValue = "50",
  ) {
    const channel = this.page.locator(
      `[data-test-id="Channel-${channelName}"]`,
    );
    await channel.locator(this.sellingPriceInput).fill(sellingPriceValue);
  }

  async typeCostPrice(channelName: string, costPriceValue = "40") {
    const channel = this.page.locator(
      `[data-test-id="Channel-${channelName}"]`,
    );
    await channel.locator(this.costPriceInput).fill(costPriceValue);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }
  async selectOneChannelAsAvailable() {
    await this.manageChannelsButton.click();
    await this.channelSelectDialog.clickAllChannelsCheckbox();
    await this.channelSelectDialog.selectFirstChannel();
    await this.channelSelectDialog.clickConfirmButton();
  }

  async clickCreateProductButton() {
    await this.createProductButton.click();
  }
  async clickFirstEditVariantButton() {
    await this.editVariantButton.first().click();
  }

  async gotoProductListPage() {
    await this.page.goto(URL_LIST.products);
  }
}
