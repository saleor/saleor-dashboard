import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class ExtensionsPage extends BasePage {
  readonly page: Page;

  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly addExtensionsOpenDropdownButton = page.getByTestId("add-extension-button"),
    readonly installedExtensionsList = page.getByTestId("extensions-installed"),
    readonly availableExtensions = page.getByTestId("extensions-list"),

    readonly appManifestUrlInput = page.getByTestId("manifest-url-input").locator("input"),
    readonly installAppFromManifestButton = page.getByTestId("install-app-from-manifest"),
    readonly installedExtensionsRow = page.getByTestId("installed-extension-row"),
    readonly extensionViewDetailsButton = page.locator("[data-test-id*='view-details']"),
    readonly pluginDetailsView = page.locator('[data-test-id="plugin-details"]'),
    readonly appKlaviyoViewDetailsButton = page.getByTestId("klaviyo-view-details"),
    readonly appQA = page.getByTestId("app-saleorqa app"),
    readonly installationPendingLabel = page.getByTestId("app-pending-label").first(),
    readonly availableAppsLoader = page.getByTestId("available-apps-loader"),
    readonly appExtensionExploreInstallButtons = page.locator(
      '[data-test-id="app-install-button"]',
    ),
    readonly pluginExtensionExploreInstallButtons = page.locator(
      '[data-test-id="plugin-install-button"]',
    ),
    readonly exploreExtensionsOption = page.getByTestId("explore-extensions"),
    readonly installCustomExtensionOption = page.getByTestId("install-custom-extension"),
    readonly addCustomExtensionOption = page.getByTestId("add-custom-extension"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
  }

  async gotoInstalledExtensionsList() {
    await this.page.goto(URL_LIST.extensions);
  }

  async typeManifestUrl(manifestUrl: string) {
    await this.appManifestUrlInput.fill(manifestUrl);
  }

  async waitForContentLoad() {
    await this.availableAppsLoader.waitFor({ state: "hidden" });
  }

  async expectPluginDetailsViewVisible() {
    await expect(this.pluginDetailsView).toBeVisible();
  }

  async clickViewDetailsByPluginName(pluginName: string) {
    await this.page.getByRole("row", { name: new RegExp(pluginName, "i") }).click();
  }

  async expectPluginRowVisibleByName(name: string) {
    const row = this.installedExtensionsRow
      .filter({ hasText: name })
      .filter({ has: this.page.locator('a[href*="/extensions/plugin/"]') })
      .first();

    await expect(row).toBeVisible();
    await expect(row.locator('a[href*="/extensions/plugin/"]')).toBeVisible();
  }

  async expectInstalledPluginRowsCount(count: number) {
    await expect(
      this.installedExtensionsRow.filter({
        has: this.page.locator('a[href*="/extensions/plugin/"]'),
      }),
    ).toHaveCount(count);
  }
}
