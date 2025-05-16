import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

import { BasePage } from "./basePage";

export class MainMenuPage extends BasePage {
  constructor(
    page: Page,
    readonly userMenu = page.getByTestId("userMenu"),
    readonly accountSettings = page.getByTestId("account-settings-button"),
    readonly catalog = page.getByTestId("menu-item-label-catalogue"),
    readonly modeling = page.getByTestId("menu-item-label-modeling"),
    readonly models = page.getByTestId("menu-item-label-models"),
    readonly modelTypes = page.getByTestId("menu-item-label-model-types"),
    readonly categories = page.getByTestId("menu-item-label-categories"),
    readonly collections = page.getByTestId("menu-item-label-collections"),
    readonly configuration = page.getByTestId("menu-item-label-configure"),
    readonly home = page.getByTestId("menu-item-label-home"),
    readonly orders = page.getByTestId("menu-item-label-orders"),
    readonly drafts = page.getByTestId("menu-item-label-order-drafts"),
    readonly discounts = page.getByTestId("menu-item-label-discounts"),
    readonly vouchers = page.getByTestId("menu-item-label-vouchers"),
    readonly appSection = page.getByTestId("menu-item-label-apps_section"),
    readonly extensions = page.getByTestId("menu-item-label-installed-extensions"),
    readonly exploreExtensions = page.getByTestId("menu-item-label-explore-extensions"),
    readonly translations = page.getByTestId("menu-item-label-translations"),
    readonly customers = page.getByTestId("menu-item-label-customers"),
    readonly list = page.getByTestId("menu-list"),
    readonly listItem = page.getByTestId("menu-list-item"),
    readonly products = page.getByTestId("menu-item-label-products"),
    readonly menuItem = page.locator("[data-test-id*='menu-item-label-']"),
  ) {
    super(page);
  }

  async gotoAccountSettings() {
    await this.userMenu.click();
    await this.accountSettings.click();
  }

  async openDiscounts() {
    await this.discounts.click();
  }

  async openProducts() {
    await this.products.click();
  }

  async openCategories() {
    await this.products.click();
    await this.categories.click();
  }

  async openCollections() {
    await this.products.click();
    await this.collections.click();
  }

  async openTranslations() {
    await this.translations.click();
  }

  async openModeling() {
    await this.modeling.click();
  }

  async openModels() {
    /* Clicking modeling links to the first section which is models */
    await this.modeling.click();
  }

  async openModelTypes() {
    /* Clicking chevron arrow to expand the section */
    await this.modeling.locator("button").first().click();
    await this.modelTypes.click();
  }

  async openCustomers() {
    await this.customers.click();
  }

  async openConfiguration() {
    await this.configuration.click();
  }

  async openExtensions() {
    await this.extensions.click();
  }

  async openExploreExtensions() {
    await this.extensions.click();
    await this.exploreExtensions.click();
  }

  async openOrders() {
    await this.orders.click();
  }

  async openDrafts() {
    await this.orders.click();
    await this.drafts.click();
  }

  async openVouchers() {
    await this.discounts.click();
    await this.vouchers.click();
  }

  async expectMenuItemsCount(liItemsCount: number) {
    // expect li items count in menu
    await expect(this.list.locator("li")).toHaveCount(liItemsCount);
  }
}
