import { TRANSLATIONS } from "@data/e2eTestData";
import { expect, test } from "@playwright/test";
import { TranslationsPage } from "@pages/translationsPage";

test.use({ storageState: "playwright/.auth/admin.json" });
let translationsPage: TranslationsPage;
test.beforeEach(({ page }) => {
    translationsPage = new TranslationsPage(page);
});

test("TC: SALEOR_121 Should be able to add translation  @e2e @translations", async () => {
    await translationsPage.gotoTranslationsPage();
    await translationsPage.translationPl_PL.click();
    await translationsPage.page.getByText("CategoryToTranslate").click();
    await expect(translationsPage.page.getByText("Translation Category \"CategoryToTranslate\" - PL_PL")).toBeVisible();
    await translationsPage.editTranslationNameButton.click();
    await translationsPage.translationInput.fill("Kategoria do Translacji");
    await translationsPage.saveButton.click();
    await expect(translationsPage.successBanner).toBeVisible();
    await expect(translationsPage.page.getByText("Kategoria do Translacji")).toBeVisible();
});

test("TC: SALEOR_122 Should be able to edit translation  @e2e @translations", async () => {
    const newDescription = "Brukselka, szpinak, groszek, jarmuż, sałata, kapusta, cukinia, więcej brukselki. Wszystkie warzywa, jakich będziesz potrzebować, w jednym pysznym soku."

    await translationsPage.goToDirectTranslationPage("PL_PL", "products", TRANSLATIONS.translationsToBeEdited.id);
    await expect(translationsPage.page.getByText("Translation Product \"Green Juice\" - PL_PL")).toBeVisible();
    await expect(translationsPage.page.getByText("Brukselka, szpinak")).toBeVisible();
    await translationsPage.editTranslationDescriptionButton.click();
    await translationsPage.translationRichText.clear();
    await translationsPage.translationRichText.type(newDescription);

    await translationsPage.saveButton.click();
    await expect(translationsPage.successBanner).toBeVisible();
    await expect(translationsPage.page.getByText(newDescription)).toBeVisible();
});
