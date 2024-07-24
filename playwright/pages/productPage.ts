import { URL_LIST } from "@data/url";
import { DeleteDialog } from "@dialogs/deleteDialog";
import { FiltersPage } from "@pageElements/filtersPage";
import { BasePage } from "@pages/basePage";
import { ChannelSelectDialog } from "@pages/dialogs/channelSelectDialog";
import { ExportProductsDialog } from "@pages/dialogs/exportProductsDialog";
import { MetadataSeoPage } from "@pages/pageElements/metadataSeoPage";
import { RightSideDetailsPage } from "@pages/pageElements/rightSideDetailsSection";
import { Page } from "@playwright/test";
import * as faker from "faker";
import path from "path";

const productName = `e2e-productName-${faker.datatype.number()}`;
const productDescription = `e2e-productDescription-${faker.datatype.number()}`;

export class ProductPage extends BasePage {
  readonly metadataSeoPage: MetadataSeoPage;

  readonly exportProductsDialog: ExportProductsDialog;

  readonly rightSideDetailsPage: RightSideDetailsPage;

  readonly basePage: BasePage;

  readonly channelSelectDialog: ChannelSelectDialog;

  readonly deleteProductDialog: DeleteDialog;

  readonly filtersPage: FiltersPage;

  constructor(
    page: Page,
    readonly productsNames = page.getByTestId("name"),
    readonly productAvailableInChannelsText = page.getByTestId(
      "product-available-in-channels-text",
    ),
    readonly createProductButton = page.getByTestId("add-product"),
    readonly cogShowMoreButtonButton = page.getByTestId("show-more-button"),
    readonly exportButton = page.getByTestId("export"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-button"),
    readonly deleteProductButton = page.getByTestId("button-bar-delete"),
    readonly productNameInput = page.locator("[name='name']"),
    readonly addProductButton = page.getByTestId("add-product"),
    readonly productTypeInput = page.getByTestId("product-type"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly categoryInput = page.getByTestId("category"),
    readonly categoryItem = page.getByTestId("select-option"),
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
    readonly uploadProductImageButton = page.getByTestId("button-upload-image"),
    readonly chooseMediaVariantButton = page.getByTestId("choose-media-button"),
    readonly uploadSavedImagesButton = page.getByTestId("upload-images"),
    readonly uploadMediaUrlButton = page.getByTestId("upload-media-url"),
    readonly saveUploadUrlButton = page.getByTestId("upload-url-button"),
    readonly editVariantButton = page.getByTestId("row-action-button"),
    readonly productUpdateFormSection = page.getByTestId("product-update-form"),
    readonly noVariantsText = page.getByTestId("empty-data-grid-text"),
    readonly firstCategoryItem = page.locator("#downshift-0-item-0"),
    readonly visibleRadioBtn = page.locator("[name='isPublished']"),
    readonly channelAvailabilityItem = page.locator("[data-test-id*='channel-availability-item']"),
    readonly addVariantButton = page.locator("[data-test-id*='button-add-variant']"),
    readonly datagridFullscreenButton = page.locator("[data-test-id*='button-exit-fullscreen']"),
    readonly ratingInput = page.locator("[name='rating']"),
    readonly warehouseOption = page.locator("[role='menuitem']"),
    readonly costPriceInput = page.locator("[name*='costPrice']"),
    readonly sellingPriceInput = page.locator("[name*='channelListing-price']"),
    readonly firstRowDataGrid = page.locator("[data-testid='glide-cell-1-0']"),
    readonly searchInput = page.getByTestId("search-input"),
    readonly emptyDataGridListView = page.getByTestId("empty-data-grid-text"),
  ) {
    super(page);
    this.basePage = new BasePage(page);
    this.exportProductsDialog = new ExportProductsDialog(page);
    this.deleteProductDialog = new DeleteDialog(page);
    this.channelSelectDialog = new ChannelSelectDialog(page);
    this.metadataSeoPage = new MetadataSeoPage(page);
    this.rightSideDetailsPage = new RightSideDetailsPage(page);
    this.filtersPage = new FiltersPage(page);
  }

  async gotoCreateProductPage(productTypeId: string) {
    const createProductUrl = `${URL_LIST.products}${URL_LIST.productsAdd}${productTypeId}`;

    await console.log("Navigating to create product view: " + createProductUrl);
    await this.page.goto(createProductUrl);
    await this.waitForDOMToFullyLoad();
    await this.pageHeader.waitFor({ state: "visible", timeout: 50000 });
  }

  async searchforProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.waitForGrid();
    await this.waitForDOMToFullyLoad();
  }

  async gotoExistingProductPage(productId: string) {
    const existingProductUrl = `${URL_LIST.products}${productId}`;

    console.log(`Navigating to existing product: ${existingProductUrl}`);
    await this.page.goto(existingProductUrl);
    await this.waitForDOMToFullyLoad();
    await this.pageHeader.waitFor({ state: "visible", timeout: 50000 });
  }

  async clickDeleteProductButton() {
    await this.deleteProductButton.click();
  }

  async clickExportButton() {
    await this.exportButton.click();
  }

  async clickCogShowMoreButtonButton() {
    await this.cogShowMoreButtonButton.click();
  }

  async clickUploadImagesButton() {
    await this.uploadSavedImagesButton.click();
  }

  async clickUploadMediaButton() {
    await this.uploadProductImageButton.click();
  }

  async clickChooseMediaVariantButton() {
    await this.chooseMediaVariantButton.click();
  }

  async clickBulkDeleteButton() {
    await this.submitButton.click();
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

  async typeSellingPriceForChannel(channelName: string, sellingPriceValue = "50") {
    const channel = this.page.locator(`[data-test-id="Channel-${channelName}"]`);

    await channel.locator(this.sellingPriceInput).fill(sellingPriceValue);
  }

  async typeCostPrice(channelName: string, costPriceValue = "40") {
    const channel = this.page.locator(`[data-test-id="Channel-${channelName}"]`);

    await channel.locator(this.costPriceInput).fill(costPriceValue);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }

  async clickCreateProductButton() {
    await this.createProductButton.click();
  }

  async clickFirstEditVariantButton() {
    await this.editVariantButton.first().click();
  }

  async clickAddVariantButton() {
    await this.addVariantButton.nth(1).click();
  }

  async clickDatagridFullscreenButton(nthChild = 0) {
    await this.datagridFullscreenButton.nth(nthChild).click();
  }

  async gotoProductListPage() {
    await this.page.goto(URL_LIST.products);
    await this.waitForGrid();
  }

  async uploadProductImage(fileName: string) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");

    await this.clickUploadImagesButton();

    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(path.join("playwright/data/images/", fileName));
    await this.page.waitForLoadState("domcontentloaded");
  }
}
