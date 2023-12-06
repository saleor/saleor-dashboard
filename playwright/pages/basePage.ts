import { LOCATORS } from "@data/commonLocators";
import { URL_LIST } from "@data/url";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly pageHeader = page.getByTestId("page-header"),
    readonly gridCanvas = page.locator('[data-testid="data-grid-canvas"]'),
    readonly gridInput = page
      .locator('[class="clip-region"]')
      .locator("textarea"),
    readonly successBanner = page.locator(LOCATORS.successBanner),
    readonly errorBanner = page.locator(LOCATORS.errorBanner),
  ) {
    this.page = page;
  }
  async gotoCreateProductPage(productTypeId: string) {
    await this.page.goto(
      `${URL_LIST.products}${URL_LIST.productsAdd}${productTypeId}`,
    );
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }
  async gotoExistingProductPage(productId: string) {
    await console.log(
      `Navigating to existing product: ${URL_LIST.products}${productId}`,
    );
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
    await this.gridCanvas
      .locator("table")
      .waitFor({ state: "attached", timeout: 10000 });
  }

  private async findGridCellBounds(col: number, row: number) {
    return this.gridCanvas.evaluate(
      (node, { col, row }) => {
        const fiberKey = Object.keys(node).find(
          x => x && x.includes("__reactFiber"),
        );

        if (!fiberKey || !node.parentNode) return null;

        /* 
        We seek over the fiber node (hack), ignore typings for it.
      */
        const fiberParent = node.parentNode[
          fiberKey as keyof typeof node.parentNode
        ] as any;

        const bounds: { x: number; y: number; width: number; height: number } =
          fiberParent.pendingProps.children.props.gridRef.current.getBounds(
            col,
            row,
          );

        if (!bounds) return null;

        return {
          ...bounds,
          center: {
            x: bounds.x + bounds.width / 2,
            y: bounds.y + bounds.height / 2,
          },
        };
      },
      { col, row },
    );
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
    const bounds = await this.findGridCellBounds(col, row);

    if (!bounds)
      throw new Error(`Unable to find cell, col: ${col}, row: ${row}`);

    await this.page.mouse.dblclick(bounds.center.x, bounds.center.y);
    await this.gridInput.waitFor({ state: "attached" });
    await this.gridInput.fill(content);
  }
  async clickGridCell(col: number, row: number) {
    const bounds = await this.findGridCellBounds(col, row);

    if (!bounds)
      throw new Error(`Unable to find cell, col: ${col}, row: ${row}`);

    await this.page.mouse.click(bounds.center.x, bounds.center.y);
  }

  async findRowIndexBasedOnText(searchTextArray: string[]) {
    await this.waitForGrid();
    let rowIndexes: number[] = [];

    const rows = await this.page.$$eval("table tr", rows =>
      rows.map(row => row.textContent),
    );

    for (const searchedText of searchTextArray) {
      const rowIndex = rows.findIndex(rowText =>
        rowText!.includes(searchedText),
      );

      if (rowIndex !== -1) {
        console.log("Index of row containing text:", rowIndex - 1);
        // since row index starts with 1 and selecting cells in grid starts with zero there is -1 on rowIndex
        rowIndexes.push(rowIndex - 1);
      }
    }
    return rowIndexes;
  }

  // check row on grid list view
  async checkListRowsBasedOnContainingText(searchText: string[]) {
    const rowIndexes = await this.findRowIndexBasedOnText(searchText);
    for (const rowIndex of rowIndexes) {
      await this.clickGridCell(0, rowIndex);
    }
    // make sure all searched texts were found and checked
    await expect(searchText.length).toEqual(rowIndexes.length);
  }
}
