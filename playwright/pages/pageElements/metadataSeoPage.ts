import * as faker from "faker";

import type { Page } from "@playwright/test";

const metaDataName = `e2e-metaDataName-${faker.datatype.number()}`;
const metaDataValue = `e2e-metaDataValue-${faker.datatype.number()}`;
const privateMetaDataName = `e2e-privateMetaDataName-${faker.datatype.number()}`;
const privateMetaDataValue = `e2e-privateMetaDataValue-${faker.datatype.number()}`;
const seoEngineTitle = `e2e-seoSlugTitle-${faker.datatype.number()}`;
const seoDescriptionText = `e2e-seoSlugDescription-${faker.datatype.number()}`;

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
    readonly fulfillmentMetaSection = page.getByTestId(
      "fulfilled-order-section",
    ),
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
    await this.clickMetadataSectionExpandButton();
    await this.addMetaButton.click();
    await this.metaDataNameInput.fill(metaName);
    await this.metadataValueField.fill(metaValue);
    await this.clickPrivateMetadataSectionExpandButton();
    await this.addPrivateMetaButton.click();
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
