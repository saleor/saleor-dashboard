import { URL_LIST } from "@data/url";
import { BasePage } from "@pages/basePage";
import type { Page } from "@playwright/test";

export class TranslationsPage extends BasePage {
  readonly page: Page;
  readonly basePage: BasePage;

  constructor(
    page: Page,
    readonly translationPl_PL = page.getByTestId("PL_PL"),
    readonly editTranslationNameButton = page.getByTestId("edit-name"),
    readonly translationInput = page
      .getByTestId("translation-field")
      .locator("input"),
    readonly translationRichText = page
      .getByTestId("rich-text-editor-translation")
      .locator("[contenteditable]"),
    readonly editTranslationDescriptionButton = page.getByTestId(
      "edit-description",
    ),
  ) {
    super(page);
    this.page = page;
    this.basePage = new BasePage(page);
  }

  async gotoTranslationsPage() {
    await this.page.goto(URL_LIST.translations);
  }

  async goToDirectTranslationPage(
    translationCode: string,
    translatedObjectType: string,
    translatedObjectId: string,
  ) {
    const translationUrl =
      URL_LIST.translations +
      translationCode +
      "/" +
      translatedObjectType +
      "/" +
      translatedObjectId;
    await this.page.goto(translationUrl);
  }
}
