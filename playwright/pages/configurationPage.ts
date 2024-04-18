import { URL_LIST } from "@data/url";
import type { Page } from "@playwright/test";

import { BasePage } from "./basePage";

export class ConfigurationPage extends BasePage {
  constructor(
    page: Page,
    readonly pluginsButton = page.locator("[data-test-id*='plugins']"),
    readonly permissionGroupsButton = page.locator("[data-test-id*='permission-groups']"),
    readonly staffMembersButton = page.locator("[data-test-id*='staff members']"),
    readonly siteSettingsButton = page.locator("[data-test-id*='site-settings']"),
    readonly channelsButton = page.locator("[data-test-id*='channels']"),
    readonly shippingMethodsButton = page.locator("[data-test-id*='shipping methods']"),
    readonly productTypesButton = page.locator("[data-test-id*='product-types']"),
    readonly webhooksAndEventsButton = page.locator("[data-test-id*='webhooks']"),
    readonly attributesButton = page.locator("[data-test-id*='attributes']"),
    readonly pageTypesButton = page.locator("[data-test-id*='configuration-menu-page-type']"),
    readonly taxesButton = page.locator("[data-test-id*='configuration-menu-taxes']"),
  ) {
    super(page);
  }

  async openShippingMethods() {
    await this.shippingMethodsButton.click();
  }

  async openTaxes() {
    await this.taxesButton.click();
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

  async goToConfirgurationView() {
    await this.page.goto(URL_LIST.configuration);
  }

  async openWebhooksAndEvents() {
    await this.webhooksAndEventsButton.click();
  }

  async openAttributes() {
    await this.attributesButton.click();
  }

  async gotoConfigurationView() {
    await this.page.goto(URL_LIST.configuration);
  }
}
