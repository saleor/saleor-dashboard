import * as faker from "faker";

import type { Locator, Page } from "@playwright/test";

const metaDataName = `e2e-metaDataName-${faker.datatype.number()}`;
const metaDataValue = `e2e-metaDataValue-${faker.datatype.number()}`;
const privateMetaDataName = `e2e-privateMetaDataName-${faker.datatype.number()}`;
const privateMetaDataValue = `e2e-privateMetaDataValue-${faker.datatype.number()}`;
const seoEngineTitle = `e2e-seoSlugTitle-${faker.datatype.number()}`;
const seoDescriptionText = `e2e-seoSlugDescription-${faker.datatype.number()}`;

export class MetadataSeoPage {
  readonly page: Page;
  readonly seoSlugName: string;
  readonly productNameInput: Locator;
  readonly editSeoSettings: Locator;
  readonly slugInput: Locator;
  readonly seoTitleInput: Locator;
  readonly seoDescriptionInput: Locator;
  readonly expandMetadataButton: Locator;
  readonly metadataForm: Locator;
  readonly addMetaButton: Locator;
  readonly addPrivateMetaButton: Locator;
  readonly metaDataNameInput: Locator;
  readonly privateMetaDataNameInput: Locator;
  readonly metadataValueField: Locator;
  readonly privateMetadataValueField: Locator;
  readonly metaExpandButton: Locator;
  readonly metaDeletedButton: Locator;
  readonly privateMetaSection: Locator;
  readonly publicMetaSection: Locator;
  readonly fulfillmentMetaSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.seoSlugName = `e2e-seoSlug-${Math.random().toString().substring(2)}`;
    this.productNameInput = page.locator("[name='name']");
    this.editSeoSettings = page.getByTestId("edit-seo");
    this.slugInput = page.locator("[name='slug']");
    this.seoTitleInput = page.locator("[name='seoTitle']");
    this.seoDescriptionInput = page.locator("[name='seoDescription']");
    this.expandMetadataButton = page.getByTestId("expand");
    this.metadataForm = page.locator("[data-test-id='metadata-editor']");
    this.addMetaButton = page
      .locator("[data-test-is-private='false']")
      .getByTestId("add-field");
    this.addPrivateMetaButton = page
      .locator("[data-test-is-private='true']")
      .getByTestId("add-field");
    this.metaDataNameInput = page
      .locator("[data-test-is-private='false']")
      .locator("[name*='name']");
    this.privateMetaDataNameInput = page
      .locator("[data-test-is-private='true']")
      .locator("[name*='name']");
    this.metadataValueField = page
      .locator("[data-test-is-private='false']")
      .locator("[name*='value']");
    this.privateMetadataValueField = page
      .locator("[data-test-is-private='true']")
      .locator("[name*='value']");
    this.metaExpandButton = page.getByTestId("expand");
    this.metaDeletedButton = page.getByTestId("delete-field-0");
    this.privateMetaSection = page.locator("[data-test-is-private='true']");
    this.publicMetaSection = page.locator("[data-test-is-private='false']");
    this.fulfillmentMetaSection = page.getByTestId("fulfilled-order-section");
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
