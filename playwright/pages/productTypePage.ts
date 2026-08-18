import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@pages/dialogs/deleteDialog";
import type { Page } from "@playwright/test";

export class ProductTypePage extends BasePage {
  readonly deleteProductTypeDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly addProductTypeButton = page.getByTestId("add-product-type"),
    readonly notificationSuccess = page.getByTestId("notification-message"),
    readonly nameInput = page.locator("[name='name']"),
    readonly isShippingRequired = page.getByTestId("isShippingRequired").getByRole("button"),
    readonly assignProductAttributeButton = page.getByTestId("assign-products-attributes"),
    readonly hasVariantsButton = page.getByTestId("hasVariants").getByRole("button"),
    readonly shippingWeightInput = page.locator("[name='weight']"),
    readonly giftCardKindCheckbox = page.getByTestId("GIFT_CARD"),
    readonly variantSelectionCheckbox = page.getByTestId("variant-selection-checkbox"),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly bulkDeleteButton = page.getByTestId("bulk-delete-product-types"),
    readonly productTypeList = page.getByTestId("product-types-list"),
    readonly rowCheckbox = page.getByTestId("checkbox"),
    readonly createProductTypeDialog = page.getByTestId("create-product-type-dialog"),
    readonly cogsMenuButton = page.getByTestId("show-more-button"),
    readonly deleteProductTypeMenuItem = page.getByTestId("delete-product-type"),
  ) {
    super(page);
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
    const pressed = await this.isShippingRequired.getAttribute("aria-pressed");

    if (pressed !== "true") {
      await this.isShippingRequired.click();
    }

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
    await this.createProductTypeDialog.waitFor();
  }

  async gotoProductTypeListPage() {
    await this.page.goto(URL_LIST.productTypes);
  }

  async clickCreateProductTypeButton() {
    await this.addProductTypeButton.click();
    await this.createProductTypeDialog.waitFor();
  }

  async gotoExistingProductTypePage(productTypeId: string) {
    const existingProductTypeUrl = URL_LIST.productTypes + productTypeId;

    await console.log("Navigating to product type details: " + existingProductTypeUrl);
    await this.page.goto(existingProductTypeUrl);
    // The loading skeleton renders its own TopNav menu holding only
    // graphiql-redirect, so acting before the real page mounts opens a menu
    // without the delete entry.
    await this.assignProductAttributeButton.waitFor({ state: "visible", timeout: 30000 });
  }

  async clickBulkDeleteButton() {
    await this.bulkDeleteButton.click();
  }

  async clickDeleteProductType() {
    await this.cogsMenuButton.click();
    await this.deleteProductTypeMenuItem.click();
  }

  async checkProductTypesOnList(listRows: string[]) {
    for (const row of listRows) {
      const rowLocator = this.page.getByTestId(`id-${row}`);

      await rowLocator.locator("input").click();
    }
  }
}
