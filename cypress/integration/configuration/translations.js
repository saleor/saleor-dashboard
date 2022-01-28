/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { ELEMENT_TRANSLATION } from "../../elements/translations/element-translation";
import { LANGUAGES_LIST } from "../../elements/translations/languages-list";
import { urlList } from "../../fixtures/urlList";
import {
  createCategory,
  getCategory
} from "../../support/api/requests/Category";
import { deleteCategoriesStartsWith } from "../../support/api/utils/catalog/categoryUtils";
import filterTests from "../../support/filterTests";
import { enterCategoryTranslation } from "../../support/pages/translationPage";

filterTests({ definedTags: ["all"], version: "3.0.0" }, () => {
  describe("Tests for translations", () => {
    const startsWith = "Translations";
    const randomNumber = faker.datatype.number();
    const name = `${startsWith}${randomNumber}`;

    let category;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteCategoriesStartsWith(startsWith);
      createCategory(name).then(categoryResp => (category = categoryResp));
    });

    beforeEach(() => {
      cy.clearSessionData().loginUserViaRequest();
    });

    it("should create translation", () => {
      cy.visit(urlList.translations);
      enterCategoryTranslation(
        LANGUAGES_LIST.polishLanguageButton,
        category.name
      );
      cy.get(ELEMENT_TRANSLATION.editNameButton)
        .click()
        .get(SHARED_ELEMENTS.skeleton)
        .should("not.exist")
        .get(ELEMENT_TRANSLATION.translationInputField)
        .type(`TranslatedName${randomNumber}`)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .get(ELEMENT_TRANSLATION.editDescriptionButton)
        .click()
        .get(SHARED_ELEMENTS.richTextEditor.loader)
        .should("not.exist")
        .get(ELEMENT_TRANSLATION.translationInputField)
        .type(`TranslatedDescription${randomNumber}`)
        .wait(500)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .get(ELEMENT_TRANSLATION.editSeoTitleButton)
        .click()
        .get(ELEMENT_TRANSLATION.translationInputField)
        .type(`TranslatedSeoTitle${randomNumber}`)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .get(ELEMENT_TRANSLATION.editSeoDescriptionButton)
        .click()
        .get(ELEMENT_TRANSLATION.translationInputField)
        .type(`TranslatedSeoDescription${randomNumber}`)
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear();
      getCategory(category.id, "PL").then(({ translation }) => {
        expect(translation.name).to.eq(`TranslatedName${randomNumber}`);
        expect(translation.description).to.includes(
          `TranslatedDescription${randomNumber}`
        );
        expect(translation.seoTitle).to.eq(`TranslatedSeoTitle${randomNumber}`);
        expect(translation.seoDescription).to.eq(
          `TranslatedSeoDescription${randomNumber}`
        );
      });
    });
  });
});
