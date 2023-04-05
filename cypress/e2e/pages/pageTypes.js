/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PAGE_TYPE_DETAILS_SELECTORS } from "../../elements/pageTypes/pageTypeDetails";
import { PAGE_TYPES_LIST_SELECTORS } from "../../elements/pageTypes/pageTypesList";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { pageTypeDetailsUrl, urlList } from "../../fixtures/urlList";
import { createAttribute } from "../../support/api/requests/Attribute";
import {
  createPageType,
  getPageType,
} from "../../support/api/requests/PageType";

describe("Tests for page types", () => {
  const startsWith = "PageTypes";

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should create page type. TC: SALEOR_2301",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      const randomName = startsWith + faker.datatype.number();

      cy.visit(urlList.pageTypes)
        .get(PAGE_TYPES_LIST_SELECTORS.createPageTypeButton)
        .click()
        .get(PAGE_TYPE_DETAILS_SELECTORS.nameInput)
        .type(randomName)
        .addAliasToGraphRequest("PageTypeCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .confirmationMessageShouldDisappear()
        .waitForRequestAndCheckIfNoErrors("@PageTypeCreate")
        .its("response.body.data.pageTypeCreate.pageType")
        .then(pageType => {
          getPageType(pageType.id);
        })
        .then(pageType => {
          expect(pageType.name).to.eq(randomName);
        });
    },
  );

  it(
    "should assign attribute. TC: SALEOR_2302",
    { tags: ["@pages", "@allEnv"] },
    () => {
      const randomName = startsWith + faker.datatype.number();

      createAttribute({ name: randomName, type: "PAGE_TYPE" });
      createPageType(randomName)
        .then(({ pageType }) => {
          cy.visit(pageTypeDetailsUrl(pageType.id))
            .get(SHARED_ELEMENTS.progressBar)
            .should("be.not.visible")
            .get(PAGE_TYPE_DETAILS_SELECTORS.assignAttributesButton)
            .click()
            .assignElements(randomName)
            .confirmationMessageShouldDisappear();
          getPageType(pageType.id);
        })
        .then(pageType => {
          expect(pageType.attributes[0].name).to.eq(randomName);
        });
    },
  );
});
