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
  readonly gridInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeader = page.getByTestId("page-header");
    this.gridCanvas = page.locator('[data-testid="data-grid-canvas"]');
    this.gridInput = this.page.locator('[class="clip-region"]').locator("textarea")
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
  
  async waitForGrid() {
    await this.gridCanvas.locator("table")
      .waitFor({ state: "attached", timeout: 10000 })
  }

  async findGridCellBounds(col: number, row: number) {
    return this.gridCanvas.evaluate((node, { col, row }) => {
      const fiberKey = Object.keys(node).find(x => x && x.includes("__reactFiber"));
          
      if (!fiberKey || !node.parentNode) return null

      /* 
        We seek over the fiber node (hack), ignore typings for it.
      */
      const fiberParent = node.parentNode[fiberKey as keyof typeof node.parentNode] as any

      const bounds: { x: number, y: number, width: number, height: number} = fiberParent
        .pendingProps
        .children
        .props
        .gridRef
        .current
        .getBounds(col, row)

        if (!bounds) return null

        return { 
          ...bounds,
          center: {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
          }
        }
      }, { col, row })
  }


  /*
    Example:

      const basePage = new BasePage(page);
      const productPage = new ProductPage(page);

      await basePage.gotoExistingProductPage(PRODUCTS.productWithOneVariant.id);
      await productPage.editVariantButton.scrollIntoViewIfNeeded();
      await basePage.waitForGrid()
      await basePage.fillGridCell(1, 0, "New variant name")
  */

  async fillGridCell(col: number, row: number, content: string) {
    const bounds = await this.findGridCellBounds(col, row)

    if (!bounds) throw new Error(`Unable to find cell, col: ${col}, row: ${row}`)

    await this.page.mouse.dblclick(bounds.center.x, bounds.center.y)
    await this.gridInput.waitFor({ state: "attached" });
    await this.gridInput.fill(content);
  }
}
