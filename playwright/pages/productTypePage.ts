import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@pages/dialogs/deleteDialog";
import type { Page } from "@playwright/test";

export class ProductTypePage extends BasePage {
  readonly page: Page;

  readonly basePage: BasePage;

  readonly deleteProductTypeDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly addProductTypeButton = page.getByTestId("add-product-type"),
    readonly notificationSuccess = page.getByTestId("notification-message"),
    readonly nameInput = page.locator("[name='name']"),
    readonly isShippingRequired = page.locator("[name='isShippingRequired']"),
    readonly assignProductAttributeButton = page.getByTestId("assign-products-attributes"),
    readonly hasVariantsButton = page.locator("[name='hasVariants']"),
    readonly shippingWeightInput = page.locator("[name='weight']"),
    readonly giftCardKindCheckbox = page.getByTestId("product-type-kind-option-GIFT_CARD"),
    readonly variantSelectionCheckbox = page.getByTestId("variant-selection-checkbox"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-product-types"),
    readonly productTypeList = page.getByTestId("product-types-list"),
    readonly rowCheckbox = page.getByTestId("checkbox"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
    this.deleteProductTypeDialog = new DeleteDialog(page);
  }

  async typeProductTypeName(name: string) {
    await this.nameInput.fill(name);
  }

  async updateProductTypeName(name: string) {
    await this.nameInput.clear();
    await this.nameInput.fill(name);
  }

  async makeProductShippableWithWeight(weight = "10") {
    await this.isShippingRequired.click();
    await this.shippingWeightInput.fill(weight);
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async selectGiftCardButton() {
    await this.giftCardKindCheckbox.click();
  }

  async gotoAddProductTypePage() {
    console.log(`Navigating to add product type page: ${URL_LIST.productTypesAdd}`);
    await this.page.goto(URL_LIST.productTypesAdd);
  }

  async expectSuccessBanner() {
    await this.basePage.expectSuccessBanner();
  }

  async gotoProductTypeListPage() {
    await this.page.goto(URL_LIST.productTypes);
  }

  async clickCreateProductTypeButton() {
    await this.addProductTypeButton.click();
  }

  async gotoExistingProductTypePage(productTypeId: string) {
    const existingProductTypeUrl = URL_LIST.productTypes + productTypeId;

    await console.log("Navigating to product type details: " + existingProductTypeUrl);
    await this.page.goto(existingProductTypeUrl);
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async checkProductTypesOnList(listRows: string[]) {
    for (const row of listRows) {
      const rowLocator = this.page.getByTestId(`id-${row}`);

      await rowLocator.locator("input").click();
    }
  }
}
