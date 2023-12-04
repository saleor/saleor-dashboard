import * as faker from "faker";
import path from "path";

import { URL_LIST } from "@data/url";
import { ChannelSelectDialog } from "@pages/dialogs/channelSelectDialog";
import { MetadataSeoPage } from "@pages/pageElements/metadataSeoPage";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import type { Page } from "@playwright/test";

import { BasePage } from "./basePage";
import { DeleteProductDialog } from "./dialogs/deleteProductDialog";

const productName = `e2e-productName-${faker.datatype.number()}`;
const productDescription = `e2e-productDescription-${faker.datatype.number()}`;

export class ProductPage {
  readonly page: Page;

  readonly metadataSeoPage: MetadataSeoPage;
  readonly rightSideDetailsPage: RightSideDetailsPage;
  readonly basePage: BasePage;
  readonly channelSelectDialog: ChannelSelectDialog;
  readonly deleteProductDialog: DeleteProductDialog;

  constructor(
    page: Page,
    readonly productsNames = page.getByTestId("name"),
    readonly productAvailableInChannelsText = page.getByTestId(
      "product-available-in-channels-text",
    ),
    readonly createProductButton = page.getByTestId("add-product"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly deleteProductButton = page.getByTestId("button-bar-delete"),
    readonly searchProducts = page.locator(
      "[placeholder='Search Products...']",
    ),
    readonly productNameInput = page.locator("[name='name']"),
    readonly addProductButton = page.getByTestId("add-product"),
    readonly productTypeInput = page.getByTestId("product-type"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly categoryInput = page.getByTestId("category"),
    readonly categoryItem = page.getByTestId(
      "single-autocomplete-select-option",
    ),
    readonly collectionInput = page.getByTestId("collections"),
    readonly autocompleteDropdown = page.getByTestId("autocomplete-dropdown"),
    readonly descriptionInput = page
      .getByTestId("rich-text-editor-description")
      .locator("[contenteditable]"),
    readonly variantRow = page.getByTestId("product-variant-row"),
    readonly variantPrice = page.getByTestId("price"),
    readonly collectionRemoveButtons = page.getByTestId("collection-remove"),
    readonly addWarehouseButton = page.getByTestId("add-warehouse"),
    readonly stockInput = page.getByTestId("stock-input"),
    readonly productImage = page.getByTestId("product-image"),
    readonly uploadImageButton = page.getByTestId("button-upload-image"),
    readonly uploadSavedImagesButton = page.getByTestId("upload-images"),
    readonly uploadMediaUrlButton = page.getByTestId("upload-media-url"),
    readonly saveUploadUrlButton = page.getByTestId("upload-url-button"),
    readonly editVariantButton = page.getByTestId("row-action-button"),
    readonly productUpdateFormSection = page.getByTestId("product-update-form"),
    readonly firstCategoryItem = page.locator("#downshift-0-item-0"),
    readonly visibleRadioBtn = page.locator("[name='isPublished']"),
    readonly channelAvailabilityItem = page.locator(
      "[data-test-id*='channel-availability-item']",
    ),
    readonly manageChannelsButton = page.getByTestId(
      "channels-availability-manage-button",
    ),
    readonly addVariantButton = page.locator(
      "[data-test-id*='button-add-variant']",
    ),
    readonly ratingInput = page.locator("[name='rating']"),
    readonly warehouseOption = page.locator("[role='menuitem']"),
    readonly costPriceInput = page.locator("[name*='costPrice']"),
    readonly sellingPriceInput = page.locator("[name*='channel-price']"),
    readonly firstRowDataGrid = page.locator("[data-testid='glide-cell-1-0']"),
  ) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.deleteProductDialog = new DeleteProductDialog(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
  }

  async clickDeleteProductButton() {
    await this.deleteProductButton.click();
  }
  async clickUploadImagesButtonButton() {
    await this.uploadSavedImagesButton.click();
  }
  async clickUploadMediaButton() {
    await this.uploadImageButton.click();
  }
  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
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
  }

  async clickCreateProductButton() {
    await this.createProductButton.click();
  }
  async clickFirstEditVariantButton() {
    await this.editVariantButton.first().click();
  }
  async clickAddVariantButton() {
    await this.addVariantButton.click();
  }

  async gotoProductListPage() {
    await this.page.goto(URL_LIST.products);
  }

  async uploadProductImage(fileName: string) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.clickUploadImagesButtonButton();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join("playwright/data/images/", fileName));
  }
}
