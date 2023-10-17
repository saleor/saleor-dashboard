import { URL_LIST } from "@data/url";
import type { Locator, Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class ProductTypePage {
  readonly page: Page;
  basePage: BasePage;
  readonly nameInput: Locator;
  readonly isShippingRequired: Locator;
  readonly assignProductAttributeButton: Locator;
  readonly hasVariantsButton: Locator;
  readonly shippingWeightInput: Locator;
  readonly giftCardKindCheckbox: Locator;
  readonly variantSelectionCheckbox: Locator;
  readonly saveButton: Locator;
  readonly notificationSuccess: Locator;
  readonly addProductTypeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.addProductTypeButton = page.getByTestId("add-product-type");
    this.notificationSuccess = page.getByTestId("notification-message");
    this.nameInput = page.locator("[name='name']");
    this.isShippingRequired = page.locator("[name='isShippingRequired']");
    this.assignProductAttributeButton = page.getByTestId(
      "assign-products-attributes",
    );
    this.hasVariantsButton = page.locator("[name='hasVariants']");
    this.shippingWeightInput = page.locator("[name='weight']");
    this.giftCardKindCheckbox = page.getByTestId(
      "product-type-kind-option-GIFT_CARD",
    );
    this.variantSelectionCheckbox = page.getByTestId(
      "variant-selection-checkbox",
    );
    this.saveButton = page.getByTestId("button-bar-confirm");
  }

  async typeProductTypeName(name: string) {
    await this.nameInput.fill(name);
  }
  async makeProductShippableWithWeight(weight: string = "10") {
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
}
