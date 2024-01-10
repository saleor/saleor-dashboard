import type { Page } from "@playwright/test";

export class AppsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly installExternalAppButton = page.getByTestId(
      "add-app-from-manifest",
    ),
    readonly appsLogosList = page.getByTestId("app-logo"),
  ) {
    this.page = page;
  }
}
