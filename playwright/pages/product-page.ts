import * as faker from "faker";

import { LOCATORS } from "@data/common-locators";
import { MetadataSeoPage } from "@pages/metadata-seo-page";
import { RightSideDetailsPage } from "@pages/right-side-details-section";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

const productName = `e2e-productName-${faker.datatype.number()}`;
const productDescription = `e2e-productDescription-${faker.datatype.number()}`;
const productRating = `9`;

export class ProductPage {
  readonly page: Page;

  readonly productNameInput: Locator;
  readonly productTypeInput: Locator;
  readonly categoryInput: Locator;
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
  readonly editVariant: Locator;
  readonly saveButton: Locator;
  readonly firstRowDataGrid: Locator;
  readonly productUpdateFormSection: Locator;
  metadataSeoPage: MetadataSeoPage;
  rightSideDetailsPage: RightSideDetailsPage;

  constructor(page: Page) {
    this.page = page;
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.productNameInput = page.locator("[name='name']");
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
    this.editVariant = page.getByTestId("row-action-button");
    this.productUpdateFormSection = page.getByTestId("product-update-form");
    this.firstCategoryItem = page.locator("#downshift-0-item-0");
    this.visibleRadioBtn = page.locator("[name='isPublished']");
    this.channelAvailabilityItem = page.locator(
      "[data-test-id*='channel-availability-item']",
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
  async typeProductRating(rating = productRating) {
    await this.ratingInput.fill(rating);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }
  async expectSuccessBanner() {
    await expect(this.page.locator(LOCATORS.successBanner)).toBeVisible();
  }
}
