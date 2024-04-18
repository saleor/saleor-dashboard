import type { Page } from "@playwright/test";

export class AppInstallationPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly appInstallationPageHeader = page.getByTestId(
      "app-installation-page-header",
    ),
    readonly installAppButton = page.getByTestId("install-app-button"),
  ) {
    this.page = page;
  }
}
