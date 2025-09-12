import type { Page } from "@playwright/test";

export class AppInstallationPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly appInstallationPageHeader = page.getByTestId("app-installation-page-header"),
    readonly installAppButton = page.getByTestId("install-app-button"),
    readonly appManifestUrlInput = page.getByPlaceholder("https://example.com/api/manifest"),
    readonly installAppFromManifestButton = page.getByTestId("button-bar-confirm"),
  ) {
    this.page = page;
  }

  async typeManifestUrl(manifestUrl: string) {
    await this.appManifestUrlInput.click();
    await this.appManifestUrlInput.fill(manifestUrl);
  }
}
