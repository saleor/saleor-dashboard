import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { ELEMENT_TRANSLATION } from "../../elements/translations/element-translation";
import { LANGUAGES_LIST } from "../../elements/translations/languages-list";
import { urlList } from "../../fixtures/urlList";

export function updateTranslationToCategory({
  categoryName,
  translatedName,
  translatedDescription,
  translatedSeoTitle,
  translatedSeoDescription,
}) {
  cy.visit(urlList.translations);
  enterCategoryTranslation(LANGUAGES_LIST.polishLanguageButton, categoryName);
  cy.get(ELEMENT_TRANSLATION.editNameButton)
    .click()
    .get(SHARED_ELEMENTS.skeleton)
    .should("not.exist")
    .get(ELEMENT_TRANSLATION.translationInputField)
    .clearAndType(translatedName)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .get(ELEMENT_TRANSLATION.editDescriptionButton)
    .click()
    .get(SHARED_ELEMENTS.richTextEditor.loader)
    .should("not.exist")
    .get(ELEMENT_TRANSLATION.translationTextEditor)
    .clearAndType(translatedDescription)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .get(ELEMENT_TRANSLATION.editSeoTitleButton)
    .click()
    .get(ELEMENT_TRANSLATION.translationInputField)
    .clearAndType(translatedSeoTitle)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear()
    .get(ELEMENT_TRANSLATION.editSeoDescriptionButton)
    .click()
    .get(ELEMENT_TRANSLATION.translationInputField)
    .clearAndType(translatedSeoDescription)
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .confirmationMessageShouldDisappear();
}

export function enterCategoryTranslation(language, categoryName) {
  cy.addAliasToGraphRequest("CategoryTranslations");
  cy.get(language)
    .click()
    .waitForProgressBarToNotExist();
  getCategoryFromTable(categoryName);
}

function getCategoryFromTable(categoryName) {
  cy.wait("@CategoryTranslations")
    .its("response.body.data.translations.edges")
    .then(edges => {
      const isCategoryInResp = edges.find(
        edge => edge.node.category.name === categoryName,
      );

      if (isCategoryInResp) {
        cy.contains(SHARED_ELEMENTS.tableRow, categoryName).click();
      } else {
        cy.get(BUTTON_SELECTORS.nextPaginationButton).click();
        getCategoryFromTable(categoryName);
      }
    });
}
