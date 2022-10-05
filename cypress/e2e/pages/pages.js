/// <reference types="cypress"/>
/// <reference types="../../support"/>

import faker from "faker";

import { PAGE_DETAILS } from "../../elements/pages/page-details";
import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { pageDetailsUrl } from "../../fixtures/urlList";
import { createAttribute } from "../../support/api/requests/Attribute";
import {
  createPage as createPageRequest,
  getPage,
} from "../../support/api/requests/Page";
import { createPageType } from "../../support/api/requests/PageType";
import { deleteAttributesStartsWith } from "../../support/api/utils/attributes/attributeUtils";
import { deletePageTypesStartsWith } from "../../support/api/utils/pageTypeUtils";
import { attributesTypes, createPage } from "../../support/pages/pagesPage";

describe("Tests for pages", () => {
  const startsWith = `Pages`;
  const name = `${startsWith}${faker.datatype.number()}`;
  let attribute;
  let pageType;

  const attributeValuesOnPage = {
    NUMERIC: 1,
    RICH_TEXT: faker.lorem.sentence(),
    DROPDOWN: "value",
    MULTISELECT: "value",
    BOOLEAN: true,
  };

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteAttributesStartsWith(startsWith);
    deletePageTypesStartsWith(startsWith);

    createAttribute({ name, type: "PAGE_TYPE" })
      .then(attributeResp => {
        attribute = attributeResp;
        createPageType({ name, attributeId: attribute.id });
      })
      .then(({ pageType: pageTypeResp }) => (pageType = pageTypeResp));
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should create not published page",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;

      createPage({ pageName: randomName, pageTypeName: name })
        .then(page => {
          getPage(page.id);
        })
        .then(page => {
          expect(page.title).to.eq(randomName);
          expect(page.isPublished).to.be.false;
          expect(page.attributes[0].attribute.id).to.eq(attribute.id);
          getPage(page.id, "token").should("be.null");
        });
    },
  );

  it(
    "should create published page",
    { tags: ["@pages", "@allEnv", "@stable"] },
    () => {
      const randomName = `${startsWith}${faker.datatype.number()}`;

      createPage({
        pageName: randomName,
        pageTypeName: name,
        isPublished: true,
      })
        .then(page => {
          getPage(page.id, "token");
        })
        .then(page => {
          expect(page.title).to.eq(randomName);
          expect(page.isPublished).to.be.true;
          expect(page.attributes[0].attribute.id).to.eq(attribute.id);
        });
    },
  );

  Object.keys(attributesTypes).forEach(attributeType => {
    it(
      `should create page with ${attributeType} attribute`,
      { tags: ["@pages", "@allEnv"] },
      () => {
        const randomName = `${startsWith}${faker.datatype.number()}`;
        const attributeValues = [attributeValuesOnPage[attributeType]];
        createAttribute({
          name: randomName,
          type: "PAGE_TYPE",
          inputType: attributeType,
          attributeValues,
        }).then(attributeResp => {
          attribute = attributeResp;
          createPageType({ name: randomName, attributeId: attribute.id });
        });
        createPage({
          pageName: randomName,
          pageTypeName: randomName,
          attributeType,
          attributeValue: attributeValuesOnPage[attributeType],
        })
          .then(page => {
            getPage(page.id);
          })
          .then(page => {
            expect(page.attributes[0].values[0].inputType).to.eq(attributeType);
            if (attributeType !== "BOOLEAN") {
              expect(page.attributes[0].values[0].name).to.eq(
                attributeValuesOnPage[attributeType].toString(),
              );
            } else {
              expect(page.attributes[0].values[0].name).to.includes(
                "Yes".toString(),
              );
            }
          });
      },
    );
  });

  it("should delete page", { tags: ["@pages", "@allEnv", "@stable"] }, () => {
    const randomName = `${startsWith}${faker.datatype.number()}`;

    createPageRequest({
      pageTypeId: pageType.id,
      title: randomName,
    }).then(({ page }) => {
      cy.visit(pageDetailsUrl(page.id))
        .get(BUTTON_SELECTORS.deleteButton)
        .click()
        .addAliasToGraphRequest("PageRemove")
        .get(BUTTON_SELECTORS.submit)
        .click()
        .waitForRequestAndCheckIfNoErrors("@PageRemove");
      getPage(page.id).should("be.null");
    });
  });

  it("should update page", { tags: ["@pages", "@allEnv", "@stable"] }, () => {
    const randomName = `${startsWith}${faker.datatype.number()}`;
    const updatedName = `${startsWith}${faker.datatype.number()}`;

    createPageRequest({
      pageTypeId: pageType.id,
      title: randomName,
      isPublished: true,
    })
      .then(({ page }) => {
        cy.visit(pageDetailsUrl(page.id))
          .get(PAGE_DETAILS.nameInput)
          .clearAndType(updatedName)
          .get(PAGE_DETAILS.isNotPublishedCheckbox)
          .click()
          .addAliasToGraphRequest("PageUpdate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .waitForRequestAndCheckIfNoErrors("@PageUpdate");
        getPage(page.id);
      })
      .then(page => {
        expect(page.title).to.eq(updatedName);
        expect(page.isPublished).to.eq(false);
      });
  });
});
