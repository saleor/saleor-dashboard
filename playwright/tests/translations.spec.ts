import { TRANSLATIONS } from "@data/e2eTestData";
import { TranslationsPage } from "@pages/translationsPage";
import { expect } from "@playwright/test";
import { test } from "utils/testWithPermission";

test.use({ permissionName: "admin" });

let translationsPage: TranslationsPage;

test.beforeEach(({ page }) => {
  translationsPage = new TranslationsPage(page);
});
test("TC: SALEOR_121 Should be able to add translation  #e2e #translations", async () => {
  await translationsPage.gotoTranslationsPage();
  await translationsPage.translationPl.click();
  await translationsPage.page.getByText("Books", { exact: true }).click();
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Category "Books" - PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await translationsPage.editTranslationNameButton.click();
  await translationsPage.translationInput.fill("Książki");
  await translationsPage.saveButton.click();
  await translationsPage.expectSuccessBanner();
  await expect(translationsPage.page.getByText("Książki")).toBeVisible();
});
test("TC: SALEOR_122 Should be able to edit translation  #e2e #translations", async () => {
  const newDescription =
    "Każda butelka zaczyna się na jabłoni. Dojrzałe owoce trafiają prosto do tłoczni, gdzie powstaje sok o naturalnym, pełnym smaku. Nic więcej nie trzeba — tylko jabłka i czas zbiorów. Ten prosty proces pozwala zachować wszystkie wartości odżywcze i smakowe, które oferują jabłka. To jest właśnie nasz Apple Juice.";

  await translationsPage.goToDirectTranslationPage(
    "PL",
    "products",
    TRANSLATIONS.translationsToBeEdited.id,
  );
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Product "Apple Juice" - PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await expect(translationsPage.page.getByText("Spadło prosto z drzewa")).toBeVisible();
  await translationsPage.editTranslationDescriptionButton.click();
  await translationsPage.translationRichText.clear();
  await translationsPage.translationRichText.fill(newDescription);
  await translationsPage.saveButton.click();
  await translationsPage.expectSuccessBanner();
  await translationsPage.goToDirectTranslationPage(
    "PL",
    "products",
    TRANSLATIONS.translationsToBeEdited.id,
  );
  await translationsPage.waitForDOMToFullyLoad();
  await expect(translationsPage.page.getByText(newDescription)).toBeVisible();
});
test("TC: SALEOR_123 Should be able to clear translation  #e2e #translations", async () => {
  const description =
    "Letnia kolekcja Saleor obejmuje gamę produktów, które cieszą się popularnością na rynku.Sklep demonstracyjny na każdą porę roku. Saleor uchwycił słońce open source, e-commerce.";

  await translationsPage.goToDirectTranslationPage(
    "PL",
    "collections",
    TRANSLATIONS.translationsToBeCleared.id,
  );
  await translationsPage.editTranslationNameButton.waitFor({
    state: "visible",
    timeout: 50000,
  });
  await translationsPage.page
    .getByText('Translation Collection "Summer Picks" - PL')
    .waitFor({ state: "visible", timeout: 50000 });
  await expect(translationsPage.page.getByText(description)).toBeVisible();
  await translationsPage.editTranslationDescriptionButton.click();
  await translationsPage.translationRichText.clear();
  await translationsPage.saveButton.click();
  await translationsPage.expectSuccessBanner();
  await expect(translationsPage.page.getByText(description)).not.toBeVisible();
});
