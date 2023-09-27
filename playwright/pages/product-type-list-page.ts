import { URL_LIST } from "@data/url";
import type {
  Locator,
  Page,
} from "@playwright/test";

export class ProductTypeListPage {
  readonly page: Page;
  readonly addProductTypeButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.addProductTypeButton = page.getByTestId("add-product-type");
  }
  async goto() {
    await this.page.goto(URL_LIST.productTypes);
  }

  async clickCreateProductTypeButton() {
    await this.addProductTypeButton.click();
  }
}
