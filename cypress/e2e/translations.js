/// <reference types="cypress"/>
/// <reference types="../support"/>

import faker from "faker";

import {
  createCategory,
  getCategory,
  updateCategoryTranslation,
} from "../support/api/requests/Category";
import { updateTranslationToCategory } from "../support/pages/translationsPage";

describe("As an admin I want to manage translations", () => {
  const startsWith = "TestTranslations - " + Date.now();
  const randomNumber = faker.datatype.number();
  const slug = `${faker.lorem.slug()}slug`;

  let category;

  before(() => {
    cy.loginUserViaRequest();
    createCategory({ name: startsWith, slug }).then(categoryResp => {
      category = categoryResp;
      cy.checkIfDataAreNotNull({ category });
    });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
  });

  it(
    "should be able to create new translation. TC:SALEOR_1701",
    { tags: ["@translations", "@allEnv", "@stable"] },
    () => {
      const translatedName = `TranslatedName${randomNumber}`;
      const translatedDescription = `TranslatedDescription${randomNumber}`;
      const translatedSeoTitle = `TranslatedSeoTitle${randomNumber}`;
      const translatedSeoDescription = `TranslatedSeoDescription${randomNumber}`;

      updateTranslationToCategory({
        categoryName: category.name,
        translatedName,
        translatedDescription,
        translatedSeoTitle,
        translatedSeoDescription,
      });
      getCategory(category.id, "PL")
        .its("translation")
        .should("include", { name: `${translatedName}` })
        .and("include", { seoDescription: `${translatedSeoDescription}` })
        .and("include", { seoTitle: `${translatedSeoTitle}` })
        .its("description")
        .should("have.string", `{"text": "${translatedDescription}"}`);
    },
  );

  it(
    "should be able to update translation. TC:SALEOR_1702",
    { tags: ["@translations", "@allEnv", "@stable"] },
    () => {
      const startWithUpdate = `Translations_Update_${randomNumber}`;
      const seoTitleUpdate = `${startWithUpdate}_seoTitle`;
      const seoDescriptionUpdate = `${startWithUpdate}_seoDescription`;
      const nameUpdate = `${startWithUpdate}_nameUpdate`;
      const descriptionUpdate = `${startWithUpdate}_descryptionUpdate`;

      updateCategoryTranslation({
        categoryTranslateId: category.id,
        languageCode: "PL",
        seoTitle: "test",
        seoDescription: "test",
        name: "test",
        description: "test",
      }).then(() => {
        updateTranslationToCategory({
          categoryName: category.name,
          translatedName: nameUpdate,
          translatedDescription: descriptionUpdate,
          translatedSeoTitle: seoTitleUpdate,
          translatedSeoDescription: seoDescriptionUpdate,
        });
        getCategory(category.id, "PL")
          .its("translation")
          .should("include", { name: `${nameUpdate}` })
          .and("include", { seoDescription: `${seoDescriptionUpdate}` })
          .and("include", { seoTitle: `${seoTitleUpdate}` })
          .its("description")
          .should("have.string", `{"text": "${descriptionUpdate}"}`);
      });
    },
  );
});
