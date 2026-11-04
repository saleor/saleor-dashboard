import { expect, type Page } from "@playwright/test";

type CataloguePicker = "categories" | "collections" | "products" | "variants";

const ASSIGN_BUTTON_TEST_ID: Record<CataloguePicker, string> = {
  categories: "assign-category-button",
  collections: "assign-collection-button",
  products: "assign-products",
  variants: "assign-variant",
};

const exactly = (text: string): RegExp => new RegExp(`^\\s*${text}\\s*$`);

/**
 * A voucher's Eligible products pickers, on Create voucher and on a saved voucher, and the
 * filter panel inside each picker.
 */
export class VoucherPage {
  readonly dialog = this.page.getByRole("dialog");

  readonly filtersButton = this.page.getByTestId("modal-filters-button");

  readonly filtersPanel = this.page.getByTestId("modal-filters-panel");

  readonly addFilterButton = this.page.getByTestId("add-filter-button");

  readonly applyFiltersButton = this.page.getByTestId("save-filters-button");

  readonly firstFilterValue = this.page.getByTestId("right-0");

  readonly option = this.page.getByRole("option");

  readonly errorScreen = this.page.getByText(/encountered an unexpected error/i);

  constructor(private readonly page: Page) {}

  async gotoCreate(): Promise<void> {
    await this.page.goto("/discounts/vouchers/add");
  }

  async gotoVoucher(id: string): Promise<void> {
    await this.page.goto(`/discounts/vouchers/${encodeURIComponent(id)}`);
  }

  /** Products scope shows the Eligible products pickers; on a saved voucher it needs no save. */
  async chooseProductsScope(): Promise<void> {
    await this.page.getByRole("radio", { name: /^Products/ }).click();
  }

  async openPicker(picker: CataloguePicker): Promise<void> {
    await this.page.getByTestId(ASSIGN_BUTTON_TEST_ID[picker]).click();
    await expect(this.dialog).toBeVisible();
  }

  async closePicker(): Promise<void> {
    await this.dialog.getByRole("button", { name: "Back" }).click();
    await expect(this.dialog).toBeHidden();
  }

  /** Filters by the first value of a product attribute. */
  async filterByAttribute(attribute: string): Promise<void> {
    await this.addFilter("Attribute");
    await this.chooseInPanel(1, attribute);
    await this.firstFilterValue.click();
    await this.option.first().click();
    await this.applyFilters();
  }

  async filterPublishedIn(channel: string): Promise<void> {
    await this.addFilter("Is published");
    await this.firstFilterValue.click();
    await this.option
      .filter({ hasText: exactly("Yes") })
      .first()
      .click();
    // "Is published" adds a required Channel row below; its value is the panel's sixth combobox.
    await this.chooseInPanel(5, channel);
    await this.applyFilters();
  }

  private async addFilter(field: string): Promise<void> {
    await this.filtersButton.click();
    await this.addFilterButton.click();
    await this.chooseInPanel(0, field);
  }

  private async chooseInPanel(combobox: number, option: string): Promise<void> {
    await this.filtersPanel.getByRole("combobox").nth(combobox).click();
    await this.option
      .filter({ hasText: exactly(option) })
      .first()
      .click();
  }

  private async applyFilters(): Promise<void> {
    // Closes an open option list without closing the dialog, which Escape would do.
    await this.filtersPanel.getByText("Conditions").click();
    await this.applyFiltersButton.click();
  }
}
