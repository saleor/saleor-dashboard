import type { Locator, Page } from "@playwright/test";
import { ContentCreateDialog } from "../pages/dialogs/contentCreateDialog";
import { URL_LIST } from "@data/url";

export class ContentPage {
  readonly page: Page;
  contentCreateDialog: ContentCreateDialog;

  constructor(
    page: Page,
    readonly createContentButton = page.getByTestId("create-page"),
    readonly titleInput = page.getByTestId("page-title"),
    readonly contentRichText = page.getByTestId("rich-text-editor-content"),
    readonly expandSeoSectionButton = page.getByTestId("edit-seo"),
    readonly seoSlugInput = page.getByTestId("seo-slug-input"),
    readonly seoTitleInput = page.getByTestId("seo-title-input"),
    readonly seoDescriptionInput = page.getByTestId("seo-description-input"),
    readonly attributeValueInput = page.getByTestId("attribute-Tag"),
    readonly attributeValueOption = page.getByTestId("select-option"),
  ) {
    this.page = page;
    this.contentCreateDialog = new ContentCreateDialog(page);
  }
  async goToContentPage() {
    await this.page.goto(URL_LIST.pages);
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
    await this.page
      .locator('[role="progressbar"]')
      .first()
      .waitFor({ state: "hidden" });
    await this.attributeValueOption.first().click()
    await this.page.pause();
  }

  async addMetadata() {}

  async addPrivateMetadata() {}
}
