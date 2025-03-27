import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class ExtensionsPage extends BasePage {
  readonly page: Page;

  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly installExternalAppButton = page.getByTestId("add-app-from-manifest"),
    readonly installedExtensionsList = page.getByTestId("apps-installed"),
    readonly availableExtensions = page.getByTestId("extensions-list"),

    readonly appManifestUrlInput = page.getByTestId("manifest-url-input").locator("input"),
    readonly installAppFromManifestButton = page.getByTestId("install-app-from-manifest"),
    readonly installedAppRow = page.getByTestId("apps:installed-app-row"),
    readonly appKlaviyo = page.getByTestId("app-klaviyo"),
    readonly appQA = page.getByTestId("app-saleorqa app"),
    readonly installationPendingLabel = page.getByTestId("app-pending-label").first(),
    readonly availableAppsLoader = page.getByTestId("available-apps-loader"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
  }

  async gotoExtensionsList() {
    await this.page.goto(URL_LIST.extensions);
  }

  async typeManifestUrl(manifestUrl: string) {
    await this.appManifestUrlInput.fill(manifestUrl);
  }

  async waitForContentLoad() {
    await this.availableAppsLoader.waitFor({ state: "hidden" });
  }
}
