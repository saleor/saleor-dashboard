import type { Locator, Page } from "@playwright/test";

export class AppsPage {
  readonly page: Page;
  readonly installExternalAppButton: Locator;
  readonly appsLogosList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.installExternalAppButton = page.getByTestId("add-app-from-manifest");
    this.appsLogosList = page.getByTestId("app-logo");
  }
}
