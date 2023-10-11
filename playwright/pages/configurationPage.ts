import type { Locator, Page } from "@playwright/test";

export class ConfigurationPage {
  readonly page: Page;
  readonly channelsButton: Locator;
  readonly productTypesButton: Locator;
  readonly webhooksAndEventsButton: Locator;
  readonly taxesButton: Locator;
  readonly permissionGroupsButton: Locator;
  readonly pluginsButton: Locator;
  readonly pageTypesButton: Locator;
  readonly siteSettingsButton: Locator;
  readonly staffMembersButton: Locator;
  readonly shippingMethodsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pluginsButton = page.locator("[data-test-id*='plugins']");
    this.permissionGroupsButton = page.locator(
      "[data-test-id*='permission-groups']",
    );
    this.staffMembersButton = page.locator("[data-test-id*='staff members']");
    this.siteSettingsButton = page.locator("[data-test-id*='site-settings']");
    this.channelsButton = page.locator("[data-test-id*='channels']");
    this.shippingMethodsButton = page.locator(
      "[data-test-id*='shipping methods']",
    );
    this.productTypesButton = page.locator("[data-test-id*='product-types']");
    this.webhooksAndEventsButton = page.locator("[data-test-id*='webhooks']");
    this.pageTypesButton = page.locator(
      "[data-test-id*='configuration-menu-page-type']",
    );
    this.taxesButton = page.locator(
      "[data-test-id*='configuration-menu-taxes']",
    );
  }

  async openShippingMethods() {
    await this.shippingMethodsButton.click();
  }
  async openChannels() {
    await this.channelsButton.click();
  }
  async openPermissionGroups() {
    await this.permissionGroupsButton.click();
  }
  async openStaffMembers() {
    await this.staffMembersButton.click();
  }
  async openSiteSettings() {
    await this.siteSettingsButton.click();
  }
  async openProductTypes() {
    await this.productTypesButton.click();
  }
  async openPageTypes() {
    await this.pageTypesButton.click();
  }
  async openPlugins() {
    await this.pluginsButton.click();
  }
  async openWebhooksAndEvents() {
    await this.webhooksAndEventsButton.click();
  }
}
