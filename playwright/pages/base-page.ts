import { URL_LIST } from "@data/url";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class BasePage {
  public page: Page;
  public pageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId("page-header");
  }
  async gotoCreateProductPage(productTypeId: string) {
    await this.page.goto(
      `${URL_LIST.products}${URL_LIST.productsAdd}${productTypeId}`,
    );
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
}
