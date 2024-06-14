import { LOCATORS } from "@data/commonLocators";
import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly pageHeader = page.getByTestId("page-header"),
    readonly pageHeaderStatusInfo = page.getByTestId("status-info"),
    readonly bulkDeleteGridRowsButton = page.getByTestId("bulk-delete-button"),
    readonly gridCanvas = page.locator('[data-testid="data-grid-canvas"]'),
    readonly gridInput = page.locator('[class="clip-region"]').locator("textarea"),
    readonly successBanner = page.locator(LOCATORS.successBanner),
    readonly deleteButton = page.locator(LOCATORS.deleteButton),
    readonly filterButton = page.getByTestId("filters-button"),
    readonly errorBanner = page.locator(LOCATORS.errorBanner),
    readonly saveButton = page.locator(LOCATORS.saveButton),
    readonly infoBanner = page.locator(LOCATORS.infoBanner),
    readonly loader = page.locator(LOCATORS.loader),
    readonly previousPagePaginationButton = page.getByTestId("button-pagination-back"),
    readonly rowNumberButton = page.getByTestId("PaginationRowNumberSelect"),
    readonly rowNumberOption = page.getByTestId("rowNumberOption"),
    readonly nextPagePaginationButton = page.getByTestId("button-pagination-next"),
    readonly searchInputListView = page.getByTestId("search-input"),
    readonly emptyDataGridListView = page.getByTestId("empty-data-grid-text"),
    readonly dialog = page.getByRole("dialog"),
    readonly submitButton = page.getByTestId("submit"),
    readonly giftCardInTable = page.locator('[href*="/dashboard/gift-cards/.*]'),
    readonly selectAllCheckbox = page.getByTestId("select-all-checkbox").locator("input"),
  ) {
    this.page = page;
  }

  async getGridCellText(rowNumber: number, tdNumber: number) {
    const cellText = await this.gridCanvas
      .locator("table tbody tr")
      .nth(rowNumber)
      .locator("td")
      .nth(tdNumber)
      .innerText();

    return cellText;
  }

  async selectAll() {
    await this.selectAllCheckbox.click();
  }

  async clickPaginationRowNumberOption(value: string) {
    await this.rowNumberOption.filter({ hasText: value }).click();
  }

  async clickFilterButton() {
    await this.filterButton.click();
  }

  async clickBulkDeleteGridRowsButton() {
    await this.bulkDeleteGridRowsButton.click();
  }

  async clickDeleteButton() {
    await this.deleteButton.click();
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async typeInSearchOnListView(searchItem: string) {
    await this.waitForNetworkIdleAfterAction(async () => {
      await this.searchInputListView.fill(searchItem);
    });
    await expect(this.searchInputListView).toHaveValue(searchItem);
    await this.waitForDOMToFullyLoad();
  }

  async clickNextPageButton() {
    await this.nextPagePaginationButton.click();
    await expect(this.errorBanner, "No error banner should be visible").not.toBeVisible();
  }

  async clickPreviousPageButton() {
    await this.previousPagePaginationButton.click();
    await expect(this.errorBanner, "No error banner should be visible").not.toBeVisible();
  }

  async clickNumbersOfRowsButton() {
    await this.rowNumberButton.click();
  }

  async expectGridToBeAttached() {
    await expect(this.gridCanvas).toBeAttached({
      timeout: 10000,
    });
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async expectSuccessBannerMessage(msg: string) {
    await this.successBanner.locator(`text=${msg}`).waitFor({ state: "visible", timeout: 10000 });
    await expect(this.errorBanner, "No error banner should be visible").not.toBeVisible();
  }

  async expectErrorBannerMessage(msg: string) {
    await this.errorBanner.locator(`text=${msg}`).waitFor({ state: "visible", timeout: 10000 });
  }

  async expectSuccessBanner() {
    await this.successBanner.first().waitFor({ state: "visible", timeout: 15000 });
    await expect(this.errorBanner, "No error banner should be visible").not.toBeVisible();
  }

  async expectInfoBanner() {
    await this.infoBanner.first().waitFor({ state: "visible", timeout: 15000 });
    await expect(this.errorBanner, "No error banner should be visible").not.toBeVisible();
  }

  async waitForNetworkIdleAfterAction(action: () => Promise<void>, timeoutMs = 90000) {
    const responsePromise = this.page.waitForResponse("**/graphql/", {
      timeout: timeoutMs,
    });

    await action();
    await responsePromise;
  }

  async waitForRequestsToFinishBeforeAction(action: () => Promise<void>, timeoutMs = 90000) {
    const responsePromise = this.page.waitForResponse("**/graphql/", {
      timeout: timeoutMs,
    });

    await responsePromise;
    await action();
  }

  async resizeWindow(w: number, h: number) {
    await this.page.setViewportSize({ width: w, height: h });
  }

  async clickOnSpecificPositionOnPage(x: number, y: number) {
    await this.page.mouse.click(x, y);
  }

  async getRandomInt(max: number) {
    return Math.floor(Math.random() * (max + 1));
  }

  async waitForGrid(gridIndex = 0) {
    await this.gridCanvas
      .locator("table")
      .nth(gridIndex)
      .locator("tbody tr")
      .first()
      .waitFor({ state: "attached", timeout: 50000 });
  }

  private async findGridCellBounds(col: number, row: number, nthChild = 0) {
    return this.gridCanvas.nth(nthChild).evaluate(
      (node, { col, row }) => {
        const fiberKey = Object.keys(node).find(x => x && x.includes("__reactFiber"));

        if (!fiberKey || !node.parentNode) return null;

        /*
        We seek over the fiber node (hack), ignore typings for it.
      */
        const fiberParent = node.parentNode[fiberKey as keyof typeof node.parentNode] as any;

        const bounds: { x: number; y: number; width: number; height: number } =
          fiberParent.pendingProps.children.props.gridRef.current.getBounds(col, row);

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

  async checkGridCellTextAndClick(
    columnNumber: number,
    rowsToCheck: number[],
    listToCheck: string[],
  ) {
    await this.waitForDOMToFullyLoad();

    const searchResults = [];

    for (let i = 0; i < rowsToCheck.length; i++) {
      const searchResult = await this.getGridCellText(rowsToCheck[i], columnNumber);

      searchResults.push(searchResult);
      await expect(searchResult).toEqual(listToCheck[i]);
      await this.clickGridCell(columnNumber, rowsToCheck[i]);
    }
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

  async fillGridCell(col: number, row: number, content: string, nthChild = 0) {
    const bounds = await this.findGridCellBounds(col, row, nthChild);

    if (!bounds) throw new Error(`Unable to find cell, col: ${col}, row: ${row}`);

    await this.page.mouse.dblclick(bounds.center.x, bounds.center.y);
    await this.gridInput.waitFor({ state: "attached" });
    await this.gridInput.fill(content);
  }

  async clickGridCell(col: number, row: number, nthChild = 0) {
    const bounds = await this.findGridCellBounds(col, row, nthChild);

    if (!bounds) throw new Error(`Unable to find cell, col: ${col}, row: ${row}`);

    await this.page.mouse.click(bounds.center.x, bounds.center.y);
  }

  async findRowIndexBasedOnText(searchTextArray: string[]) {
    await this.waitForDOMToFullyLoad();

    await this.gridCanvas.locator("table tr").first().waitFor({ state: "attached" });

    await this.page.waitForSelector("table tr", { state: "attached" });

    const rows = await this.page.locator("table tr").allTextContents();

    const rowIndexes: number[] = [];

    for (const searchedText of searchTextArray) {
      const rowIndex = rows.findIndex(rowText => rowText.includes(searchedText));

      if (rowIndex !== -1) {
        console.log("Index of row containing text:", rowIndex - 1);
        rowIndexes.push(rowIndex - 1);
      }
    }

    return rowIndexes;
  }

  async searchAndFindRowIndexes(searchItem: string) {
    await this.typeInSearchOnListView(searchItem);

    await this.page.waitForTimeout(1000);

    return await this.findRowIndexBasedOnText([searchItem]);
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

  async clickListRowBasedOnContainingText(searchText: string) {
    const rowIndex = await this.findRowIndexBasedOnText([searchText]);

    await this.clickGridCell(1, rowIndex[0]);
  }

  async expectElementContainsTextFromObjectValues(locator: Locator, object: object) {
    const objectValuesArray = await Object.values(object);

    for (const objectProperty of objectValuesArray) {
      expect(locator).toContainText(objectProperty);
    }
  }

  async getNumberOfGridRowsWithText(expectedText: string) {
    await this.gridCanvas
      .locator("tr")
      .filter({ hasText: expectedText })
      .first()
      .waitFor({ state: "attached", timeout: 10000 });

    const gridRowsWithText = await this.gridCanvas
      .locator("tr")
      .filter({ hasText: expectedText })
      .count();

    return gridRowsWithText;
  }

  async getNumberOfGridRows() {
    await this.gridCanvas.locator("tr").first().waitFor({ state: "attached" });

    const gridRowsWithText = await this.gridCanvas.locator("tr").count();

    return gridRowsWithText;
  }

  async waitForDOMToFullyLoad() {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 70000 });
    await this.loader.waitFor({ state: "hidden", timeout: 70000 });
  }

  async expectElementIsHidden(locator: Locator) {
    await locator.first().waitFor({
      state: "hidden",
      timeout: 30000,
    });
  }

  async waitForCanvasContainsText(text: string) {
    await this.gridCanvas.getByText(text).waitFor({ state: "attached", timeout: 50000 });
  }
}
