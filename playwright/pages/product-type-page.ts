import { LOCATORS } from "@data/common-locators";
import { URL_LIST } from "@data/url";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class ProductTypePage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly isShippingRequired: Locator;
  readonly assignProductAttributeButton: Locator;
  readonly hasVariantsButton: Locator;
  readonly shippingWeightInput: Locator;
  readonly giftCardKindCheckbox: Locator;
  readonly variantSelectionCheckbox: Locator;
  readonly saveButton: Locator;
  readonly notificationSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
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
  async goto() {
    await this.page.goto(URL_LIST.productTypesAdd);
  }
  async expectSuccessBanner() {
    await expect(this.page.locator(LOCATORS.successBanner)).toBeVisible();
  }
}
