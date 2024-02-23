import type { Locator, Page } from "@playwright/test";
import { ContentCreateDialog } from "@dialogs/contentCreateDialog";
import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import { DeleteDialog } from "@dialogs/deleteDialog";

export class ContentPage extends BasePage {
  readonly page: Page;
  contentCreateDialog: ContentCreateDialog;
  deleteDialog: DeleteDialog;

  constructor(
    page: Page,
    readonly createContentButton = page.getByTestId("create-page"),
    readonly titleInput = page.getByTestId("page-title").locator("input"),
    readonly contentRichText = page
      .getByTestId("rich-text-editor-content")
      .locator('[contenteditable="true"]'),
    readonly expandSeoSectionButton = page.getByTestId("edit-seo"),
    readonly seoSlugInput = page.getByTestId("seo-slug-input"),
    readonly seoTitleInput = page.getByTestId("seo-title-input"),
    readonly seoDescriptionInput = page.getByTestId("seo-description-input"),
    readonly attributeValueInput = page.getByTestId("attribute-Tag"),
    readonly attributeValueOption = page.getByTestId("select-option"),
    readonly metadata = page.locator(
      "[data-test-id='metadata-editor'][data-test-is-private='false']",
    ),
    readonly expandMetadata = metadata.getByTestId("expand"),
    readonly addMetadataButton = metadata.getByTestId("add-field"),
    readonly metadataFieldInput = metadata.getByTestId("metadata-field-input"),
    readonly metadataValueInput = metadata.getByTestId("metadata-value-input"),
    readonly privateMetadata = page.locator(
      "[data-test-id='metadata-editor'][data-test-is-private='true']",
    ),
    readonly expandPrivateMetadata = privateMetadata.getByTestId("expand"),
    readonly addPrivateMetadataButton = privateMetadata.getByTestId(
      "add-field",
    ),
    readonly privateMetadataFieldInput = privateMetadata.getByTestId(
      "metadata-field-input",
    ),
    readonly privateMetadataValueInput = metadata.getByTestId(
      "metadata-value-input",
    ),
    readonly saveButton = page.getByTestId("button-bar-confirm"),
    readonly deleteButton = page.getByTestId("button-bar-delete"),
  ) {
    super(page);
    this.page = page;
    this.contentCreateDialog = new ContentCreateDialog(page);
    this.deleteDialog = new DeleteDialog(page);
  }
  async goToContentPage() {
    await this.page.goto(URL_LIST.pages);
  }
  async goToContentDetailsPage(pageId: string) {
    await this.page.goto(`${URL_LIST.pages}${pageId}`);
  }
  async clickCreateContent() {
    await this.createContentButton.click();
  }
  async fillTitle(title: string) {
    await this.titleInput.fill(title);
  }

  async fillContent(content: string) {
    await this.contentRichText.fill(content);
  }

  async fillSeoInfo(slug: string, title: string, description: string) {
    await this.expandSeoSectionButton.click();
    await this.seoSlugInput.fill(slug);
    await this.seoTitleInput.fill(title);
    await this.seoDescriptionInput.fill(description);
  }

  async addAttribute() {
    await this.attributeValueInput.click();
    await this.attributeValueOption.first().click();
  }

  async addMetadata(field: string, value: string) {
    await this.expandMetadata.click();
    await this.addMetadataButton.click();
    await this.metadataFieldInput.fill(field);
    await this.metadataValueInput.fill(value);
  }

  async addPrivateMetadata(field: string, value: string) {
    await this.expandPrivateMetadata.click();
    await this.addPrivateMetadataButton.click();
    await this.privateMetadataFieldInput.fill(field);
    await this.privateMetadataValueInput.fill(value);
  }
  async clickSaveButton() {
    await this.saveButton.click();
  }
  async clickDeletePageButton() {
    await this.deleteButton.click();
  }
}
