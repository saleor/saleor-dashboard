import { URL_LIST } from "@data/url";
import { expect, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly channelSelect = page.getByTestId("app-channel-select"),
    readonly channelOptions = page.getByTestId("select-option"),
    /**
     * The home route is extension-driven: it renders widget panels when home
     * extensions are installed and the Pulse empty state otherwise. The sidebar
     * entry is the one anchor present for every user and permission set, so use
     * it to gate "dashboard is loaded" instead of route content.
     */
    readonly dashboardLoaded = page.getByTestId("menu-item-label-home"),
    readonly emptyState = page.getByTestId("home-pulse-cta"),
    readonly widgetsGrid = page.getByTestId("home-widgets-grid-panel"),
    readonly fullscreenWidgetPanel = page.locator('[data-test-id^="home-widget-panel-"]'),
  ) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(URL_LIST.homePage);
  }

  async waitForDashboardToLoad(timeout = 30000) {
    await this.dashboardLoaded.waitFor({ state: "visible", timeout });
  }

  async clickChannelSelectButton() {
    await this.channelSelect.click();
  }

  async selectDifferentChannelThanGiven(defaultChannelName: string) {
    await this.channelOptions.filter({ hasNotText: defaultChannelName }).first().click();
  }

  /** Home resolves to a fullscreen widget, the widgets grid, or the empty state. */
  async expectHomeContentToBeVisible() {
    await expect(
      this.fullscreenWidgetPanel.first().or(this.widgetsGrid).or(this.emptyState),
    ).toBeVisible();
  }
}
