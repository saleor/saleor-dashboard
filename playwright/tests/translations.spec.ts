import { TRANSLATIONS } from "@data/e2eTestData";
import { TranslationsPage } from "@pages/translationsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let translationsPage: TranslationsPage;

test.beforeEach(({ page }) => {
  translationsPage = new TranslationsPage(page);
});
test("TC: SALEOR_121 Should be able to add translation  @e2e @translations", async () => {
  await translationsPage.gotoTranslationsPage();
  await translationsPage.translationPl_PL.click();
  await translationsPage.page.getByText("CategoryToTranslate").click();
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Category "CategoryToTranslate" - PL_PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await translationsPage.editTranslationNameButton.click();
  await translationsPage.translationInput.fill("Kategoria do Translacji");
  await translationsPage.saveButton.click();
  await expect(translationsPage.successBanner).toBeVisible();
  await expect(translationsPage.page.getByText("Kategoria do Translacji")).toBeVisible();
});
test("TC: SALEOR_122 Should be able to edit translation  @e2e @translations", async () => {
  const newDescription =
    "Brukselka, szpinak, groszek, jarmuż, sałata, kapusta, cukinia, więcej brukselki. Wszystkie warzywa, jakich będziesz potrzebować, w jednym pysznym soku.";

  await translationsPage.goToDirectTranslationPage(
    "PL_PL",
    "products",
    TRANSLATIONS.translationsToBeEdited.id,
  );
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Product "Green Juice" - PL_PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await expect(translationsPage.page.getByText("Brukselka, szpinak")).toBeVisible();
  await translationsPage.editTranslationDescriptionButton.click();
  await translationsPage.translationRichText.clear();
  await translationsPage.translationRichText.fill(newDescription);
  await translationsPage.saveButton.click();
  await expect(translationsPage.successBanner).toBeVisible();
  await translationsPage.goToDirectTranslationPage(
    "PL_PL",
    "products",
    TRANSLATIONS.translationsToBeEdited.id,
  );
  await translationsPage.waitForDOMToFullyLoad();
  await expect(translationsPage.page.getByText(newDescription)).toBeVisible();
});
test("TC: SALEOR_123 Should be able to clear translation  @e2e @translations", async () => {
  const description =
    "Letnia kolekcja Saleor obejmuje gamę produktów, które cieszą się popularnością na rynku.Sklep demonstracyjny na każdą porę roku.Saleor uchwycił słońce open source, e-commerce.";

  await translationsPage.goToDirectTranslationPage(
    "PL_PL",
    "collections",
    TRANSLATIONS.translationsToBeCleared.id,
  );
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Collection "Summer collection" - PL_PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await expect(translationsPage.page.getByText(description)).toBeVisible();
  await translationsPage.editTranslationDescriptionButton.click();
  await translationsPage.translationRichText.clear();
  await translationsPage.saveButton.click();
  await expect(translationsPage.successBanner).toBeVisible();
  await expect(translationsPage.page.getByText(description)).not.toBeVisible();
});
