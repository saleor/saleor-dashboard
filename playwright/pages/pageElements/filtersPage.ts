import type { Page } from "@playwright/test";

export class FiltersPage {
  readonly page: Page;
  constructor(
    page: Page,
    readonly saveFiltersButton = page.getByTestId("save-filters-button"),
    readonly rightInput = page.getByTestId("right-0"),
    readonly dropDownOptions = page.getByTestId("select-option"),
    readonly leftInput = page.getByTestId("left-0"),
    readonly showFiltersButton = page.getByTestId("filters-button"),
    readonly addFilterButton = page.getByTestId("add-filter-button"),
  ) {
    this.page = page;
  }

  async clickAddFilterButton() {
    await this.addFilterButton.click();
  }

  async clickLeftInput() {
    await this.leftInput.click();
  }

  async clickRightInput() {
    await this.rightInput.click();
  }

  async clickSaveFiltersButton() {
    await this.saveFiltersButton.click();
  }

  async pickFilter(filterKind: string, channelName: string) {
    await this.clickAddFilterButton();
    await this.clickLeftInput();
    await this.dropDownOptions.filter({ hasText: filterKind }).click();
    await this.clickRightInput();
    await this.dropDownOptions.filter({ hasText: channelName }).click();
  }
}
