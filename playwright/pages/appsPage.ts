import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { expect, Page } from "@playwright/test";

export class AppsPage extends BasePage {
  readonly page: Page;

  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly installExternalAppButton = page.getByTestId("add-app-from-manifest"),
    readonly appLogo = page.getByTestId("app-logo"),
    readonly installedAppsList = page.getByTestId("apps-installed"),
    readonly availableAppsList = page.getByTestId("apps-available"),
    readonly upcomingAppsList = page.getByTestId("apps-upcoming"),

    readonly appManifestUrlInput = page.getByTestId("manifest-url-input").locator("input"),
    readonly installAppFromManifestButton = page.getByTestId("install-app-from-manifest"),
    readonly installedAppRow = page.getByTestId("apps:installed-app-row"),
    readonly appKlaviyo = page.getByTestId("app-klaviyo"),
    readonly appAdyen = page.getByTestId("app-adyen"),
    readonly appQA = page.getByTestId("app-saleorqa app"),
    readonly installationPendingLabel = page.getByTestId("app-pending-label").first(),
    readonly availableAppsLoader = page.getByTestId("available-apps-loader"),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
  }

  async gotoAppsList() {
    await this.page.goto(URL_LIST.apps);
  }

  async typeManifestUrl(manifestUrl: string) {
    await this.appManifestUrlInput.fill(manifestUrl);
  }

  async waitForContentLoad() {
    await this.availableAppsLoader.waitFor({ state: "hidden" });
  }
}
