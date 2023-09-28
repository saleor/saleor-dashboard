import { URL_LIST } from "@data/url";
import type {
  Locator,
  Page,
} from "@playwright/test";

export class ProductListPage {
  readonly page: Page;
  readonly productsNames: Locator;
  readonly createProductButton: Locator;
  readonly searchProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsNames = page.getByTestId("name");
    this.createProductButton = page.getByTestId("add-product");
    this.searchProducts = page.locator("[placeholder='Search Products...']");
  }

  async clickCreateProductButton() {
    await this.createProductButton.click();
  }

  async goto() {
    await this.page.goto(URL_LIST.products);
  }
}
