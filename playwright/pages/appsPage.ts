import type { Page } from "@playwright/test";
import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";

export class AppsPage extends BasePage {
  readonly page: Page;
  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly installExternalAppButton = page.getByTestId(
      "add-app-from-manifest",
    ),
    readonly appsLogosList = page.getByTestId("app-logo"),
    readonly appManifestUrlInput = page
      .getByTestId("manifest-url-input")
      .locator("input"),
    readonly installAppFromManifestButton = page.getByTestId("install-app-from-manifest"),
    readonly installedAppRow = page.getByTestId("apps:installed-app-row"),
    readonly appKlaviyo = page.getByTestId("app-klaviyo"),
    readonly appAdyen = page.getByTestId("app-adyen"),
    readonly installationPendingLabel = page.getByTestId("app-pending-label").first(),
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
}
