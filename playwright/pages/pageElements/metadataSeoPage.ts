import type { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const metaDataName = `e2e-metaDataName-${faker.number.int(99999)}`;
const metaDataValue = `e2e-metaDataValue-${faker.number.int(99999)}`;
const privateMetaDataName = `e2e-privateMetaDataName-${faker.number.int(99999)}`;
const privateMetaDataValue = `e2e-privateMetaDataValue-${faker.number.int(99999)}`;
const seoEngineTitle = `e2e-seoSlugTitle-${faker.number.int(99999)}`;
const seoDescriptionText = `e2e-seoSlugDescription-${faker.number.int(99999)}`;

export class MetadataSeoPage {
  readonly page: Page;

  readonly seoSlugName: string;

  constructor(
    page: Page,
    readonly productNameInput = page.locator("[name='name']"),
    readonly editSeoSettings = page.getByTestId("edit-seo"),
    readonly slugInput = page.locator("[name='slug']"),
    readonly seoTitleInput = page.locator("[name='seoTitle']"),
    readonly seoDescriptionInput = page.locator("[name='seoDescription']"),
    readonly expandMetadataButton = page.getByTestId("expand"),
    readonly metadataForm = page.locator("[data-test-id='metadata-editor']"),
    readonly metaExpandButton = page.getByTestId("expand"),
    readonly metaDeletedButton = page.getByTestId("delete-field-0"),
    readonly privateMetaSection = page.locator("[data-test-is-private='true']"),
    readonly publicMetaSection = page.locator("[data-test-is-private='false']"),
    readonly fulfillmentMetaSection = page.getByTestId("fulfilled-order-section"),
    readonly addMetaButton = page
      .locator("[data-test-is-private='false']")
      .getByTestId("add-field"),
    readonly addPrivateMetaButton = page
      .locator("[data-test-is-private='true']")
      .getByTestId("add-field"),
    readonly metaDataNameInput = page
      .locator("[data-test-is-private='false']")
      .locator("[name*='name']"),
    readonly privateMetaDataNameInput = page
      .locator("[data-test-is-private='true']")
      .locator("[name*='name']"),
    readonly metadataValueField = page
      .locator("[data-test-is-private='false']")
      .locator("[name*='value']"),
    readonly privateMetadataValueField = page
      .locator("[data-test-is-private='true']")
      .locator("[name*='value']"),
  ) {
    this.page = page;
    this.seoSlugName = `e2e-seoSlug-${Math.random().toString().substring(2)}`;
  }

  async expandAndAddAllMetadata(
    metaName = metaDataName,
    metaValue = metaDataValue,
    privateMetaName = privateMetaDataName,
    privateMetaValue = privateMetaDataValue,
  ) {
    // Wait for public metadata section to be visible before expanding
    await this.publicMetaSection.waitFor({ state: "visible", timeout: 2_000 });
    await this.clickMetadataSectionExpandButton();
    await this.addMetaButton.waitFor({ state: "visible", timeout: 1_000 });
    await this.addMetaButton.click();
    await this.metaDataNameInput.waitFor({ state: "visible", timeout: 1_000 });
    await this.metaDataNameInput.fill(metaName);
    await this.metadataValueField.fill(metaValue);
    // Wait for private metadata section before expanding
    await this.privateMetaSection.waitFor({ state: "visible", timeout: 1_000 });
    await this.clickPrivateMetadataSectionExpandButton();
    await this.addPrivateMetaButton.waitFor({ state: "visible", timeout: 1_000 });
    await this.addPrivateMetaButton.click();
    await this.privateMetaDataNameInput.waitFor({ state: "visible", timeout: 1_000 });
    await this.privateMetaDataNameInput.fill(privateMetaName);
    await this.privateMetadataValueField.fill(privateMetaValue);
  }

  async fillSeoSection(
    seoSlug = this.seoSlugName,
    seoTitleEngine = seoEngineTitle,
    seoDescription = seoDescriptionText,
  ) {
    await this.clickSeoSectionEditButton();
    await this.slugInput.fill(seoSlug);
    await this.seoTitleInput.fill(seoTitleEngine);
    await this.seoDescriptionInput.fill(seoDescription);
  }

  async clickSeoSectionEditButton() {
    await this.editSeoSettings.click();
  }

  async clickMetadataSectionExpandButton() {
    await this.expandMetadataButton.first().click();
  }

  async clickPrivateMetadataSectionExpandButton() {
    await this.expandMetadataButton.last().click();
  }
}
