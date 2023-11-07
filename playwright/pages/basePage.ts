import { LOCATORS } from "@data/commonLocators";
import { URL_LIST } from "@data/url";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly pageHeader: Locator;
  readonly gridCanvas: Locator;
  readonly successBanner: Locator;
  readonly errorBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId("page-header");
    this.gridCanvas = page.locator('[data-testid="data-grid-canvas"]');
    this.successBanner = page.locator(LOCATORS.successBanner);
    this.errorBanner = page.locator(LOCATORS.errorBanner);
  }
  async gotoCreateProductPage(productTypeId: string) {
    await this.page.goto(
      `${URL_LIST.products}${URL_LIST.productsAdd}${productTypeId}`,
    );
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
  async gotoExistingProductPage(productId: string) {
    await this.page.goto(`${URL_LIST.products}${productId}`);
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
  async expectGridToBeAttached() {
    await expect(this.gridCanvas).toBeAttached({
      timeout: 10000,
    });
  }
  async expectSuccessBannerMessage(msg: string) {
    await this.successBanner
      .locator(`text=${msg}`)
      .waitFor({ state: "visible", timeout: 10000 });
    await expect(this.errorBanner).not.toBeVisible();
  }
  async expectSuccessBanner() {
    await this.successBanner
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
    await expect(this.errorBanner).not.toBeVisible();
  }

  async getRandomInt(max: number) {
    return Math.floor(Math.random() * (max + 1));
  }
}
