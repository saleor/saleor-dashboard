import { URL_LIST } from "@data/url";
import { expect, Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly channelSelect = page.getByTestId("app-channel-select"),
    readonly channelOptions = page.locator("[data-test-id*='select-field-option']"),
    readonly welcomeMessage = page.getByTestId("home-header"),
    readonly sales = page.getByTestId("sales-analytics"),
    readonly orders = page.getByTestId("orders-analytics"),
    readonly activity = page.getByTestId("activity-card"),
    readonly topProducts = page.getByTestId("top-products"),
    readonly ordersReadyToFulfill = page.getByTestId("orders-to-fulfill"),
    readonly paymentsWaitingForCapture = page.getByTestId("orders-to-capture"),
    readonly productsOutOfStock = page.getByTestId("out-of-stock-analytics"),
  ) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL_LIST.homePage);
  }

  async clickChannelSelectButton() {
    await this.channelSelect.click();
  }

  async selectDifferentChannelThanGiven(defaultChannelName: string) {
    await this.channelOptions.filter({ hasNotText: defaultChannelName }).first().click();
  }

  async expectHomePageElementsToBeVisible() {
    await expect(this.sales).toBeVisible();
    await expect(this.activity).toBeVisible();
    await expect(this.topProducts).toBeVisible();
    await expect(this.productsOutOfStock).toBeVisible();
  }
}
