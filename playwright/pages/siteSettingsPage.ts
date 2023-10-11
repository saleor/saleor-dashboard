import type { Locator, Page } from "@playwright/test";

export class SiteSettingsPage {
  readonly page: Page;
  readonly companyInfoSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.companyInfoSection = page.locator('[data-test-id="company-info"]');
  }
}
