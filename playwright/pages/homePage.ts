import { URL_LIST } from "@data/url";
import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly sales: Locator;
  readonly orders: Locator;
  readonly activity: Locator;
  readonly topProducts: Locator;
  readonly ordersReadyToFulfill: Locator;
  readonly paymentsWaitingForCapture: Locator;
  readonly productsOutOfStock: Locator;
  readonly channelSelect: Locator;
  readonly channelOptions: Locator;

  constructor(page: Page) {
    this.page = page;
    this.channelSelect = page.getByTestId("app-channel-select");
    this.channelOptions = page.locator("[data-test-id*='select-field-option']");
    this.welcomeMessage = page.getByTestId("home-header");
    this.sales = page.getByTestId("sales-analytics");
    this.orders = page.getByTestId("orders-analytics");
    this.activity = page.getByTestId("activity-card");
    this.topProducts = page.getByTestId("top-products");
    this.ordersReadyToFulfill = page.getByTestId("orders-to-fulfill");
    this.paymentsWaitingForCapture = page.getByTestId("orders-to-capture");
    this.productsOutOfStock = page.getByTestId("products-out-of-stock");
  }
  async goto() {
    await this.page.goto(URL_LIST.homePage);
  }

  async clickChannelSelectButton() {
    await this.channelSelect.click();
  }

  async selectDifferentChannelThanGiven(defaultChannelName: string) {
    await this.channelOptions
      .filter({ hasNotText: defaultChannelName })
      .first()
      .click();
  }

  async expectHomePageElementsToBeVisible() {
    await expect(this.sales).toBeVisible();
    await expect(this.orders).toBeVisible();
    await expect(this.activity).toBeVisible();
    await expect(this.topProducts).toBeVisible();
    await expect(this.ordersReadyToFulfill).toBeVisible();
    await expect(this.paymentsWaitingForCapture).toBeVisible();
    await expect(this.productsOutOfStock).toBeVisible();
  }
}
