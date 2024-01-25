import type { Page } from "@playwright/test";

export class SiteSettingsPage {
  readonly page: Page;

  constructor(
    page: Page,
    readonly companyInfoSection = page.locator('[data-test-id="company-info"]'),
  ) {
    this.page = page;
  }
}
